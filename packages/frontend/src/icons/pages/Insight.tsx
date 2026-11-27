import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function InsightIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <circle cx="8.6" cy="8.6" r="5.9" strokeWidth="1.7" />
      <path d="M13 13l4.5 4.5" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
