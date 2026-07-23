import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function HomeIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Home icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path
        d="M2.85 8V2C2.85 1.91716 2.91716 1.85 3 1.85H8C8.08284 1.85 8.15 1.91716 8.15 2V8C8.15 8.08284 8.08284 8.15 8 8.15H3C2.91716 8.15 2.85 8.08284 2.85 8Z"
        strokeWidth="1.7"
      />
      <path
        d="M11.85 11V2C11.85 1.91716 11.9172 1.85 12 1.85H17C17.0828 1.85 17.15 1.91716 17.15 2V11C17.15 11.0828 17.0828 11.15 17 11.15H12C11.9172 11.15 11.85 11.0828 11.85 11Z"
        strokeWidth="1.7"
      />
      <path
        d="M2.85 18V12C2.85 11.9172 2.91716 11.85 3 11.85H8C8.08284 11.85 8.15 11.9172 8.15 12V18C8.15 18.0828 8.08284 18.15 8 18.15H3C2.91716 18.15 2.85 18.0828 2.85 18Z"
        strokeWidth="1.7"
      />
      <path
        d="M11.85 18V15C11.85 14.9172 11.9172 14.85 12 14.85H17C17.0828 14.85 17.15 14.9172 17.15 15V18C17.15 18.0828 17.0828 18.15 17 18.15H12C11.9172 18.15 11.85 18.0828 11.85 18Z"
        strokeWidth="1.7"
      />
    </SvgIcon>
  )
}
