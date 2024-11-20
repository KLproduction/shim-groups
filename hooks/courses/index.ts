import { CreateCourseSchema } from "@/components/global/create-course/sechma"
import {
  onCreateCourseModule,
  onCreateGroupCourse,
  onCreateModuleSection,
  onGetCourseModules,
  onUpdateModule,
  onUpdateSection,
} from "@/data/course"
import { onGetGroupInfo } from "@/data/groups"
import { upload } from "@/lib/uploadcare"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { use, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 } from "uuid"
import { z } from "zod"

export const useCreateCourse = (groupId: string) => {
  const [onPrivacy, setOnPrivacy] = useState<string | undefined>("open")
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      privacy: "open",
      published: false,
    },
  })

  useEffect(() => {
    const privacy = watch(({ privacy }) => setOnPrivacy(privacy))
    return () => privacy.unsubscribe()
  }, [watch])

  const query = useQueryClient()

  const { data } = useQuery({
    queryKey: ["groups-info"],
    queryFn: () => onGetGroupInfo(groupId),
  })

  const { mutate, isPending, variables } = useMutation({
    mutationKey: ["create-course-mutation"],
    mutationFn: async (data: {
      id: string
      name: string
      image: FileList
      description: string
      createdAt: Date
      privacy: string
      published: boolean
    }) => {
      const uploaded = await upload.uploadFile(data.image[0])
      const course = await onCreateGroupCourse(
        groupId,
        data.name,
        uploaded.uuid,
        data.description,
        data.id,
        data.privacy,
        data.published,
      )
      return course
    },
    onSuccess: (data) => {
      buttonRef.current?.click()

      return data.status !== 200
        ? toast.error(data.message)
        : toast.success(data.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["groups-info"],
      })
      await query.invalidateQueries({
        queryKey: ["group-courses"],
      })
    },
  })

  const onCreateCourse = handleSubmit((values) =>
    mutate({
      id: v4(),
      createdAt: new Date(),
      image: values.image,
      ...values,
    }),
  )
  return {
    onCreateCourse,
    register,
    errors,
    buttonRef,
    variables,
    isPending,
    onPrivacy,
    setValue,
    data,
  }
}

export const useCourses = (groupId: string) => {
  const { data } = useQuery({
    queryKey: ["group-courses"],
    queryFn: () => onGetGroupInfo(groupId),
  })

  return { data }
}

export const useCreateModule = (courseId: string, groupId: string) => {
  const query = useQueryClient()

  const { data } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupId),
  })

  const { mutate, isPending, variables } = useMutation({
    mutationKey: ["create-module"],
    mutationFn: (data: { courseId: string; title: string; moduleId: string }) =>
      onCreateCourseModule(data.courseId, data.title, data.moduleId),
    onSuccess: (data) => {
      if (data.status !== 200) {
        toast.error(data.message)
      } else {
        toast.success(data.message)
      }
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["group-info"],
      })
      await query.invalidateQueries({
        queryKey: ["create-module"],
      })
    },
  })

  const onCreateModule = () =>
    mutate({
      courseId,
      title: "New Module",
      moduleId: v4(),
    })

  return {
    onCreateModule,
    isPending,
    variables,
    data,
  }
}

export const useCourseModule = (courseId: string, groupId: string) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const contentRef = useRef<HTMLAnchorElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const sectionInputRef = useRef<HTMLInputElement | null>(null)
  const [edit, setEdit] = useState<boolean>(false)
  const [editSection, setEditSection] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string | undefined>(
    undefined,
  )
  const [moduleId, setModuleId] = useState<string | undefined>(undefined)

  const { data } = useQuery({
    queryKey: ["course-modules"],
    queryFn: () => onGetCourseModules(courseId),
  })

  const { data: groupOwner } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupId),
  })

  const pathname = usePathname()

  const query = useQueryClient()

  const { mutate, isPending, variables } = useMutation({
    mutationFn: (data: { type: "NAME" | "DATA"; content: string }) =>
      onUpdateModule(moduleId!, data.type, data.content),
    onMutate: () => {
      setEdit(false)
    },
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data?.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["course-modules"],
      })
    },
  })

  const {
    mutate: updateSection,
    isPending: sectionUpdatePending,
    variables: updateVariables,
  } = useMutation({
    mutationFn: (data: { type: "NAME" | "COMPLETE"; content: string }) =>
      onUpdateSection(activeSection!, data.type, data.content),
    onMutate: () => setEditSection(false),
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data?.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["course-modules"],
      })
    },
  })

  const {
    mutate: mutateSection,
    variables: sectionVariables,
    isPending: pendingSection,
  } = useMutation({
    mutationFn: (data: { moduleId: string; sectionId: string }) =>
      onCreateModuleSection(data.moduleId, data.sectionId),
    onSuccess: (data) => {
      return data?.status !== 200
        ? toast.error(data?.message)
        : toast.success(data?.message)
    },
    onSettled: async () => {
      await query.invalidateQueries({
        queryKey: ["course-modules"],
      })
    },
  })
  const onEditModuleName = (e: Event) => {
    if (inputRef.current && triggerRef.current) {
      if (
        !inputRef.current.contains(e.target as Node | null) &&
        !triggerRef.current.contains(e.target as Node | null)
      ) {
        if (inputRef.current.value) {
          mutate({ type: "NAME", content: inputRef.current.value })
        } else {
          setEdit(false)
        }
      }
    }
  }
  const onEditSectionName = (e: Event) => {
    if (sectionInputRef.current && triggerRef.current) {
      if (
        !sectionInputRef.current.contains(e.target as Node | null) &&
        !triggerRef.current.contains(e.target as Node | null)
      ) {
        if (sectionInputRef.current.value) {
          updateSection({
            type: "NAME",
            content: sectionInputRef.current.value,
          })
        } else {
          setEditSection(false)
        }
      }
    }
  }
  useEffect(() => {
    document.addEventListener("click", onEditModuleName, false)
    return () => document.removeEventListener("click", onEditModuleName, false)
  }, [moduleId])
  useEffect(() => {
    document.addEventListener("click", onEditSectionName, false)
    return () => document.removeEventListener("click", onEditSectionName, false)
  }, [activeSection])

  const onEditModule = (id: string) => {
    setEdit(true)
    setModuleId(id)
  }
  const onEditSection = () => setEditSection(true)
  return {
    onEditModule,
    edit,
    triggerRef,
    variables,
    pathname,
    isPending,
    groupOwner,
    sectionVariables,
    pendingSection,
    mutateSection,
    setActiveSection,
    activeSection,
    contentRef,
    onEditSection,
    sectionInputRef,
    sectionUpdatePending,
    updateVariables,
    data,
  }
}
