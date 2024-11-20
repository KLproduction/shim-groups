import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { AccordionTrigger } from "@radix-ui/react-accordion"
import React, { RefObject } from "react"

type Props = {
  id: string
  title: string
  ref?: RefObject<HTMLButtonElement>
  onEdit?(): void
  edit?: boolean
  editable?: React.ReactNode
  children: React.ReactNode
}

const GlobalAccordion = ({
  title,
  id,
  ref,
  onEdit,
  edit,
  editable,
  children,
}: Props) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem className=" border-none" value={id}>
        <AccordionTrigger
          className=" font-bold capitalize"
          onDoubleClick={onEdit}
          ref={ref}
        >
          {edit ? editable : title}
        </AccordionTrigger>
        {children}
      </AccordionItem>
    </Accordion>
  )
}

export default GlobalAccordion
