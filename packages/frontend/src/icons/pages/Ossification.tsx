import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function OssificationIcon({ className, ...props }: SvgIconProps) {
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
        d="M6.62 11.47L11.47 6.62A2.35 2.35 0 1 1 15.21 4.79A2.35 2.35 0 1 1 13.38 8.53L8.53 13.38A2.35 2.35 0 1 1 4.79 15.21A2.35 2.35 0 1 1 6.62 11.47Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}
