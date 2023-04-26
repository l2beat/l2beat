import React, { SVGAttributes } from 'react'
import { Icon } from '../Icon'

export function CodeIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon stroke="var(--text)" {...props}>
      <g clip-path="url(#clip0_190_6173)">
        <path
          d="M9.20005 2L6.80005 14"
          stroke-width="1.4"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.8 4.3999L15.3458 7.9999L12.8 11.5999"
          stroke-width="1.4"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.34585 11.5999L0.800049 7.9999L3.34585 4.3999"
          stroke-width="1.4"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_190_6173">
          <rect width="16" height="16" />
        </clipPath>
      </defs>
    </Icon>
  )
}
