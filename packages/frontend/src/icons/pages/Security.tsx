import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function SecurityIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Security icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <rect x="4" y="8" width="12" height="9" rx="2" strokeWidth="1.7" />
      <path
        d="M7 8V6a3 3 0 0 1 6 0v2"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M10 12v1.5" strokeWidth="1.7" strokeLinecap="round" />
    </SvgIcon>
  )
}
