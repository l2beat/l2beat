import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function SummaryIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-label="Summary icon"
      {...props}
    >
      <g clipPath="url(#clip0_78_3)">
        <g clipPath="url(#clip1_78_3)">
          <path
            d="M10.4646 1.16431C5.5663 1.16431 1.59573 5.13488 1.59573 10.0331C1.59573 14.9314 5.5663 18.902 10.4646 18.902C12.8485 18.902 15.0081 17.9565 16.6018 16.4262L10.4646 10.0331V1.16431Z"
            fill="#50E6FF"
          />
          <path
            d="M19.3334 10.0331C19.3334 5.13488 15.3628 1.16431 10.4646 1.16431V10.0331H19.3334Z"
            fill="#0078D4"
          />
          <path
            d="M19.3334 10.0331H10.4646L16.6018 16.4262C18.2824 14.8121 19.3334 12.5475 19.3334 10.0331Z"
            fill="#00A5FF"
          />
          <path
            d="M14.5865 0.0654602L10.4576 10.0332L20.4998 6.112C19.4684 3.47146 17.412 1.23604 14.5865 0.0654602Z"
            fill="#D864FF"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_78_3">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
        <clipPath id="clip1_78_3">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
