import type { SvgIconProps } from './svg-icon'
import { SvgIcon } from './svg-icon'

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
      <path d="M3.3 8.63L6.23 11.53L12.7 5.07" />
    </SvgIcon>
  )
}
