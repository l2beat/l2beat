import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MinimizeIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="32" height="32" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m20.414 5l-4.5 4.5H20v2h-7.5V4h2v4.086l4.5-4.5zM4 12.5h7.5V20h-2v-4.086l-4.5 4.5L3.586 19l4.5-4.5H4z"
      />
    </SvgIcon>
  )
}
