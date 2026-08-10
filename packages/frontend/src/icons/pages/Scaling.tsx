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
        d="M1.85 18v-7a.15.15 0 01.15-.15h7a.15.15 0 01.15.15v7a.15.15 0 01-.15.15H2a.15.15 0 01-.15-.15"
        strokeWidth="1.7"
      />
      <path
        d="M5.85 14V2A.15.15 0 016 1.85h12a.15.15 0 01.15.15v12a.15.15 0 01-.15.15H6a.15.15 0 01-.15-.15"
        strokeWidth="1.7"
      />
      <path
        d="m11 9 4-4m0 0h-3m3 0v3"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}
