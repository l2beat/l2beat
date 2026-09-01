import type { SvgIconProps } from '../SvgIcon'
import { SvgIcon } from '../SvgIcon'

export function ZKStackIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="ZKStack logo"
      {...props}
    >
      <path
        d="m24 11.787-6.808-6.784V9.97l-6.76 4.974 6.76.005v3.62z"
        className="fill-[#010100] dark:fill-current"
      />
      <path
        d="m0 11.784 6.808 6.784V13.64l6.76-5.015-6.76-.004V5z"
        className="fill-[#010100] dark:fill-current"
      />
    </SvgIcon>
  )
}
