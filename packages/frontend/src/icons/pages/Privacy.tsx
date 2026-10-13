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
        d="M8.94 4.23a8.95 8.95 0 0 1 9.34 5.48.83.83 0 0 1 0 .58 8.96 8.96 0 0 1-1.2 2.07"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.74 11.8a2.5 2.5 0 0 1-3.54-3.54"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.57 14.58a8.96 8.96 0 0 1-12.85-4.29.83.83 0 0 1 0-.58 8.96 8.96 0 0 1 3.7-4.29"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m2.5 2.5 15 15" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
