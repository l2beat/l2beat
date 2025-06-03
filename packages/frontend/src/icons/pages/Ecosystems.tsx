import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function EcosystemsIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <path
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
        strokeWidth="1.7"
        strokeMiterlimit="10"
      />
      <path
        d="M9.99996 18C11.9636 18 13.5555 14.4183 13.5555 10C13.5555 5.58172 11.9636 2 9.99996 2C8.03628 2 6.4444 5.58172 6.4444 10C6.4444 14.4183 8.03628 18 9.99996 18Z"
        strokeWidth="1.7"
        strokeMiterlimit="10"
      />
      <path d="M2.5 7.5H17.5" strokeWidth="1.7" strokeMiterlimit="10" />
      <path d="M2.5 12.5H17.5" strokeWidth="1.7" strokeMiterlimit="10" />
    </svg>
  )
}
