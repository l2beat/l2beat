import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function BridgesIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Bridges icon"
      fill="none"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <g clipPath="url(#clip0_4632_30109)">
        <path d="M2 13h16" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 13v4" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M2 9c2 0 4-2 4-6 2 8 6 8 8 0 0 4 2 6 4 6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 13v4" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <defs>
        <clipPath id="clip0_4632_30109">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
