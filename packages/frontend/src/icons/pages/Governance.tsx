import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function GovernanceIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Governance icon"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path
        d="M10 2L17.15 5V6.5H2.85V5L10 2Z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M4.5 8V15" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 8V15" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M11.5 8V15" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.5 8V15" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M2.85 17H17.15"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </SvgIcon>
  )
}
