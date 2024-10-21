import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
    className?: string
    container?: string
}

export const BackdropGradient = ({ children, className, container }: Props) => {
    return (
        <div className={cn("relative w-full flex flex-col", container)}>
            <div
                className={cn(
                    className,
                    "absolute rounded-[50%] radial--blur mx-10",
                )}
            />

            {children}
        </div>
    )
}
