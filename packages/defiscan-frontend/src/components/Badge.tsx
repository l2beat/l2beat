import { clsx } from 'clsx'
import { adminTypeBgClass } from '../utils/colors'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'admin-type' | 'governance' | 'purple' | 'dependency'
  adminType?: string
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  adminType,
  className,
}: BadgeProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'

  const variantClass =
    variant === 'admin-type' && adminType
      ? adminTypeBgClass(adminType)
      : variant === 'governance'
        ? 'bg-status-green/10 text-status-green'
        : variant === 'purple'
          ? 'bg-purple-100 text-purple-700'
          : variant === 'dependency'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-600'

  return <span className={clsx(base, variantClass, className)}>{children}</span>
}
