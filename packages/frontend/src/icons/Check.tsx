import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CheckIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path d="m3.3 8.63 2.93 2.9 6.47-6.46" />
    </SvgIcon>
  )
}
