import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 text-center bg-white border border-slate-200 rounded-lg border-dashed", className)}>
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                {description}
            </p>
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    )
}
