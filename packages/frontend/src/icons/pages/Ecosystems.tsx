import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function EcosystemsIcon({ className, ...props }: SvgIconProps) {
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
        d="M10 18a8 8 0 100-16 8 8 0 000 16"
        strokeWidth="1.7"
        strokeMiterlimit="10"
      />
      <path
        d="M10 18c1.964 0 3.556-3.582 3.556-8S11.964 2 10 2s-3.556 3.582-3.556 8S8.036 18 10 18"
        strokeWidth="1.7"
        strokeMiterlimit="10"
      />
      <path d="M2.5 7.5h15" strokeWidth="1.7" strokeMiterlimit="10" />
      <path d="M2.5 12.5h15" strokeWidth="1.7" strokeMiterlimit="10" />
    </svg>
  )
}
