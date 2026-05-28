import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

export function PrivacyIcon({ className, ...props }: SvgIconProps) {
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
        d="M10 2.5L4.5 4.5V8.9C4.5 12.5 6.78 15.79 10 17.5C13.22 15.79 15.5 12.5 15.5 8.9V4.5L10 2.5Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 9.75L9.25 11.25L12.5 8"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
