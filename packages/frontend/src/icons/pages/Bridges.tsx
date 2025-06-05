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
        <path d="M2 13H18" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 13V17" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M2.00012 8.99992C4.00012 8.99992 6.00011 6.99992 6.00011 2.99992C8 11 12 11 14.0001 2.9999C14.0001 6.9999 16 9.00006 18 9.00006"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 13V17" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <defs>
        <clipPath id="clip0_4632_30109">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
