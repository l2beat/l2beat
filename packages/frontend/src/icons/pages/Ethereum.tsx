import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function EthereumIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cn('fill-primary', className)}
      {...props}
    >
      <path d="M10 1.25 4.375 10.42 10 13.75l5.625-3.33zm0 2.95 3.47 5.66L10 11.92 6.53 9.86zM4.375 11.53 10 18.75l5.625-7.22L10 14.86zm2.98 1.97L10 15.07l2.65-1.57L10 16.9z" />
    </SvgIcon>
  )
}
