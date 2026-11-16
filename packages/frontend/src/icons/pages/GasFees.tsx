import { cn } from '~/utils/cn'
import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function GasFeesIcon({ className, ...props }: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Gas fees icon"
      className={cn('fill-primary', className)}
      {...props}
    >
      <path d="M4.5 2A1.5 1.5 0 0 0 3 3.5V16.5H2.25a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H12V11h.75c.41 0 .75.34.75.75v2.5a2 2 0 0 0 4 0V6.81a1.75 1.75 0 0 0-.51-1.24l-1.96-1.96a.75.75 0 1 0-1.06 1.06l1.03 1.03V7.5c0 .83.67 1.5 1.5 1.5v5.25a.5.5 0 0 1-1 0v-2.5a2.25 2.25 0 0 0-2.25-2.25H12V3.5A1.5 1.5 0 0 0 10.5 2zm0 1.5h6v4h-6zm0 5.5h6v7.5h-6z" />
    </SvgIcon>
  )
}
