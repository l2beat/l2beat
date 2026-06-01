import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function UserIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-label="User icon"
      {...props}
    >
      <path d="M8 1.438a2.813 2.813 0 100 5.625 2.813 2.813 0 000-5.625m2.813 7.5H5.187a2.81 2.81 0 00-2.812 2.812v2.813h11.25V11.75a2.81 2.81 0 00-2.812-2.812" />
    </SvgIcon>
  )
}
