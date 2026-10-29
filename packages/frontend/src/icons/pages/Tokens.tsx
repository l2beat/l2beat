import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function TokensIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <circle cx="7.9" cy="10" r="6.3" strokeWidth="1.7" />
      <path
        d="M11.5 4.1a6.3 6.3 0 0 1 1.2 12.5"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.9 7.3v5.4M6.1 9.1h3.6M6.1 11.2h3.6"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
