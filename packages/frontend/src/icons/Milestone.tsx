import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'

export function MilestoneIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      role="img"
      aria-label="Milestone icon"
      className={cn('fill-green-700 stroke-green-500', className)}
      {...props}
    >
      <rect
        x="9.89941"
        y="1.41421"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45 9.89941 1.41421)"
        strokeWidth="2"
      />
    </svg>
  )
}
