import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function HeartbeatIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <path
        d="M1.5 10.5h3.6l1.7-3.3 2.6 8.3 2.6-11 1.9 6h4.6"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
