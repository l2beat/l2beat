import { cn } from '~/utils/cn'
import { type SvgIconProps } from './svg-icon'

export function EthereumLineIcon({ className, ...props }: SvgIconProps) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      {...props}
      className={cn('fill-blue-500', className)}
    >
      <rect width="10" height="6" />
    </svg>
  )
}
