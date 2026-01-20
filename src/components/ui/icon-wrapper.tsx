
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconWrapperProps {
    name: string | null
    color?: string | null
    className?: string
    iconClassName?: string
}

export function IconWrapper({ name, color, className, iconClassName }: IconWrapperProps) {
    const IconsAny = Icons as any;
    // Try to find the icon, fallback to HelpCircle if not found
    const IconComp = IconsAny[name || 'Circle'] || IconsAny.Circle || Icons.HelpCircle;
    const safeColor = color || '#64748b';

    return (
        <div
            className={cn("p-2 rounded-full bg-opacity-10 shrink-0", className)}
            style={{ backgroundColor: `${safeColor}20` }}
        >
            <IconComp
                className={cn("h-4 w-4 md:h-5 md:w-5", iconClassName)}
                style={{ color: safeColor }}
            />
        </div>
    )
}
