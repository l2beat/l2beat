import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function GlobeIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      aria-label="Globe icon"
      {...props}
    >
      <path
        strokeMiterlimit="10"
        d="M8 14.875a6.875 6.875 0 1 0 0-13.75 6.875 6.875 0 0 0 0 13.75Z"
      />
      <path
        strokeMiterlimit="10"
        d="M8 14.875c1.38 0 2.5-3.078 2.5-6.875S9.38 1.125 8 1.125 5.5 4.203 5.5 8s1.12 6.875 2.5 6.875ZM1.125 8h13.75M1.89 4.875h12.22M1.89 11.125h12.22"
      />
    </SvgIcon>
  )
}
