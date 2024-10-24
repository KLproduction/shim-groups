import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
    trigger: React.ReactNode
    className?: string
    triggerClassName?: string
}

const GlassSheet = ({
    children,
    trigger,
    className,
    triggerClassName,
}: Props) => {
    return (
        <>
            <Sheet>
                <SheetTrigger className={cn(triggerClassName)} asChild>
                    {trigger}
                </SheetTrigger>
                <SheetContent
                    className={cn(
                        className,
                        "bg-chip-padding backdrop-filter backdrop--blur__safari backdrop-blur-sm bg-opacity-10 bg-transparent border-themeGray",
                    )}
                >
                    {children}
                </SheetContent>
            </Sheet>
        </>
    )
}

export default GlassSheet
