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
            d="M21 7.29091C19.8618 6.26364 18.3473 5.63636 16.686 5.63636C13.1338 5.63636 10.2609 8.48182 10.2609 12C10.2609 15.5182 13.1338 18.3636 16.686 18.3636C18.3473 18.3636 19.8618 17.7364 21 16.7091C19.3019 19.8636 15.9517 22 12.0966 22C6.51594 22 2 17.5273 2 12C2 6.47273 6.51594 2 12.0966 2C15.9517 2 19.3019 4.13636 21 7.29091Z"
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
