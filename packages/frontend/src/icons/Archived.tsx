import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

export function ArchivedIcon(props: SvgIconProps) {
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <g clipPath="url(#clip0_1975_2214)">
        <g clipPath="url(#clip1_1975_2214)">
          <path
            d="M15.242 5.414H.759v.517h14.483z"
            fill="#29512C"
          />
          <path
            d="M15.5 5.672H.5V15.5h15z"
            fill="#B568FF"
          />
          <path
            d="M15.5 5.672H.5L2.57.5h10.862z"
            fill="#9A31FF"
          />
          <path
            d="M12.139 1.571H3.863v2.143h8.276z"
            fill="#FFED9B"
          />
          <path
            d="M9.81 9.293H6.19a.776.776 0 110-1.552h3.62a.776.776 0 110 1.552"
            fill="#561793"
          />
          <path
            d="M12.655 2.857h-9.31v1.607h9.31z"
            fill="#D6AD00"
          />
          <path d="M13.69 4.25H2.31v1.425h11.38z" fill="#FFED9D" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1975_2214">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_1975_2214">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(0.500061 0.5)"
          />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
