import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function ScalingIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Scaling icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path
        d="M1.85 18V11C1.85 10.9172 1.91716 10.85 2 10.85H9C9.08284 10.85 9.15 10.9172 9.15 11V18C9.15 18.0828 9.08284 18.15 9 18.15H2C1.91716 18.15 1.85 18.0828 1.85 18Z"
        strokeWidth="1.7"
      />
      <path
        d="M5.85 14V2C5.85 1.91716 5.91716 1.85 6 1.85H18C18.0828 1.85 18.15 1.91716 18.15 2V14C18.15 14.0828 18.0828 14.15 18 14.15H6C5.91716 14.15 5.85 14.0828 5.85 14Z"
        strokeWidth="1.7"
      />
      <path
        d="M11 9L15 5M15 5H12M15 5V8"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}
