import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ArchivedIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-label="Archived project icon"
      {...props}
    >
      <g clipPath="url(#clip0_83_21)">
        <g clipPath="url(#clip1_83_21)">
          <path
            d="M15.2419 5.41379H0.759125V5.93103H15.2419V5.41379Z"
            fill="#29512C"
          />
          <path d="M15.5 5.67229H0.5V15.4999H15.5V5.67229Z" fill="#B568FF" />
          <path
            d="M15.5 5.67241H0.5L2.56897 0.5H13.431L15.5 5.67241Z"
            fill="#9A31FF"
          />
          <path
            d="M12.1384 1.57149H3.86258V3.71434H12.1384V1.57149Z"
            fill="#FFED9B"
          />
          <path
            d="M9.80984 9.29298H6.18915C5.76062 9.29298 5.41329 8.94565 5.41329 8.51712C5.41329 8.08858 5.76062 7.74126 6.18915 7.74126H9.80984C10.2384 7.74126 10.5857 8.08858 10.5857 8.51712C10.5857 8.94565 10.2384 9.29298 9.80984 9.29298Z"
            fill="#561793"
          />
          <path
            d="M12.6552 2.85713H3.34483V4.46427H12.6552V2.85713Z"
            fill="#D6AD00"
          />
          <path d="M13.6902 4.25H2.31085V5.675H13.6902V4.25Z" fill="#FFED9D" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_83_21">
          <rect width="16" height="16" fill="white" />
        </clipPath>
        <clipPath id="clip1_83_21">
          <rect
            width="15"
            height="15"
            fill="white"
            transform="translate(0.5 0.5)"
          />
        </clipPath>
      </defs>
    </Icon>
  )
}
