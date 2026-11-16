import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

/** The brackets of CodeIcon, struck through. */
export function CodeOffIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.8 4.4 15.346 8 12.8 11.6" />
      <path d="M3.346 11.6.8 8l2.546-3.6" />
      <path d="M4.4 2.4 11.6 13.6" />
    </SvgIcon>
  )
}
