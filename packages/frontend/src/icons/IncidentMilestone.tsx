import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'

export function IncidentMilestoneIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      role="img"
      aria-label="Incident icon"
      className={cn('fill-red-800 stroke-red-700', className)}
      {...props}
    >
      <path
        d="M2.118 14.497 9.136 2.465a1 1 0 011.728 0l7.018 12.032a1 1 0 01-.864 1.504H2.982a1 1 0 01-.864-1.504"
        strokeWidth="2"
      />
    </svg>
  )
}
