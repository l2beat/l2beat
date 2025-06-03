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
          d="M9.20005 2L6.80005 14"
          strokeWidth="1.4"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8 4.3999L15.3458 7.9999L12.8 11.5999"
          strokeWidth="1.4"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.34585 11.5999L0.800049 7.9999L3.34585 4.3999"
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
