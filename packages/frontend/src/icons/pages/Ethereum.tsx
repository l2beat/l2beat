import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

/** The Ethereum diamond, drawn in the line style of the nav icons. */
export function EthereumIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('stroke-primary', className)}
      {...props}
    >
      <path
        d="M10 1.75 4.75 10 10 13.1 15.25 10z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 12.4 10 18.25l5.25-5.85L10 15.5z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
