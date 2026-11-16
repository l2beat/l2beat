import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

/** The Ethereum diamond, drawn in the side nav icons' line style. */
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
        d="M10 1.75 4.5 10 10 13.2 15.5 10z"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 13 5.5 5.25L15.5 13"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  )
}
