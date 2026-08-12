import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

/** Two coins, one behind the other — a token existing in more than one place. */
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
      <circle cx="8" cy="8" r="5.25" strokeWidth="1.7" />
      <path
        d="M11 3.1a5.25 5.25 0 0 1 1 10.4"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 5.75v4.5M6.5 7.25h3M6.5 9h3"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
