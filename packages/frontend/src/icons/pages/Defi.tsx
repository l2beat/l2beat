import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function DefiIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <circle cx="10" cy="10" r="7.25" strokeWidth="1.7" />
      <path d="M10 5.25v9.5" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M12.25 7.25c-.5-.7-1.3-1-2.25-1-1.24 0-2.25.67-2.25 1.75S8.76 9.9 10 10s2.25.67 2.25 1.75S11.24 13.75 10 13.75c-.95 0-1.75-.3-2.25-1"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
