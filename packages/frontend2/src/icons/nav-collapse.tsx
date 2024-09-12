import { SvgIcon, type SvgIconProps } from './svg-icon'

export function NavCollapseIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <path d="M16.5 8L12.0633 12.4367C12.0284 12.4716 12.0284 12.5284 12.0633 12.5633L16.5 17" />
      <path d="M8 22L8 2" />
    </SvgIcon>
  )
}
