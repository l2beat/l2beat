import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MenuCloseIcon(props: SvgIconProps) {
  return (
    <SvgIcon width={24} height={24} viewBox="0 0 24 24" {...props}>
      <rect
        x="5.63599"
        y="4.22182"
        width="20"
        height="2"
        fill="currentColor"
        transform="rotate(45 5.63599 4.22182)"
      />
      <rect
        x="4.2218"
        y="18.364"
        width="20"
        height="2"
        fill="currentColor"
        transform="rotate(-45 4.2218 18.364)"
      />
    </SvgIcon>
  )
}
