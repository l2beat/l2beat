import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function PrivacyIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Privacy icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path
        d="M5.85 9.15V6C5.85 3.70883 7.70883 1.85 10 1.85C12.2912 1.85 14.15 3.70883 14.15 6V9.15"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M3.85 10C3.85 9.91716 3.91716 9.85 4 9.85H16C16.0828 9.85 16.15 9.91716 16.15 10V17.5C16.15 17.5828 16.0828 17.65 16 17.65H4C3.91716 17.65 3.85 17.5828 3.85 17.5V10Z"
        strokeWidth="1.7"
      />
      <path
        d="M10 12.5V15"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}
