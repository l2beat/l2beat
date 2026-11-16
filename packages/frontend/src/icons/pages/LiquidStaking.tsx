import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

/** A drop over a ledge: liquid staking. Drawn like the other page icons. */
export function LiquidStakingIcon({ className, ...props }: SvgIconProps) {
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
        d="M10 2.5c-2.6 3.1-4.4 5.6-4.4 7.9a4.4 4.4 0 0 0 8.8 0c0-2.3-1.8-4.8-4.4-7.9z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M3 17.5h14" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
