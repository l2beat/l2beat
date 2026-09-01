import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function CodeIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      aria-label="Code icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_190_6173)">
        <path
          d="M9.2 2 6.8 14"
          strokeWidth="1.4"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8 4.4 15.346 8 12.8 11.6"
          strokeWidth="1.4"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.346 11.6.8 8l2.546-3.6"
          strokeWidth="1.4"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_190_6173">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
