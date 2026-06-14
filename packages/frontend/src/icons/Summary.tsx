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
            d="M10.465 1.164a8.87 8.87 0 00-8.87 8.87 8.87 8.87 0 008.87 8.868 8.83 8.83 0 006.137-2.476l-6.137-6.393z"
            fill="#50E6FF"
          />
          <path
            d="M19.333 10.033a8.87 8.87 0 00-8.868-8.869v8.87z"
            fill="#0078D4"
          />
          <path
            d="M19.333 10.033h-8.868l6.137 6.393a8.84 8.84 0 002.731-6.393"
            fill="#00A5FF"
          />
          <path
            d="m14.587.065-4.13 9.968L20.5 6.112A10.75 10.75 0 0014.586.065"
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
