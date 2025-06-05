import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MenuOpenIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <rect x="2" y="5" width="20" height="2" />
      <rect x="2" y="11" width="20" height="2" />
      <rect x="2" y="17" width="20" height="2" />
    </SvgIcon>
  )
}
