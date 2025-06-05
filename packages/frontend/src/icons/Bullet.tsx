import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function BulletIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 20 20"
      width="16"
      height="20"
      fill="currentColor"
      aria-label="Bullet point icon"
      {...props}
    >
      <circle cx="10" cy="10" r="2.75" />
    </SvgIcon>
  )
}
