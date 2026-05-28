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
        d="m10 2.5-5.5 2v4.4c0 3.6 2.28 6.89 5.5 8.6 3.22-1.71 5.5-5 5.5-8.6V4.5z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m7.75 9.75 1.5 1.5L12.5 8"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
