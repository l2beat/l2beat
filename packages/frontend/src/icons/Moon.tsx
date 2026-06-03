import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function MoonIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      {...props}
    >
      <g clipPath="url(#clip0_6535_74751)">
        <g clipPath="url(#clip1_6535_74751)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21 7.29a6.42 6.42 0 00-4.314-1.654c-3.552 0-6.425 2.846-6.425 6.364s2.873 6.364 6.425 6.364A6.42 6.42 0 0021 16.709 10.09 10.09 0 0112.097 22C6.516 22 2 17.527 2 12S6.516 2 12.097 2C15.952 2 19.302 4.136 21 7.29"
            fill="#222222"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_6535_74751">
          <rect width="24" height="24" fill="white" />
        </clipPath>
        <clipPath id="clip1_6535_74751">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
