import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'

/** A sprout in the ground: the CROPS guide. Drawn like the other page icons. */
export function CropsIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('stroke-primary', className)}
      fill="none"
      {...props}
    >
      <path d="M10 17.5V9.5" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M10 12.5C10 9 7.5 6.5 2.75 6.5c0 3.5 2.5 6 7.25 6z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 9.5c0-3.8 2.5-6.75 7.25-6.75 0 3.8-2.5 6.75-7.25 6.75z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M3.5 17.5h13" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
