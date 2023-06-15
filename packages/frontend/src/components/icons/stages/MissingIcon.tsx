import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MissingIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      aria-label="Missing icon"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.94495 7.99998L2.10126 12.8437L3.72761 14.47L8.5713 9.62633L13.415 14.47L15.0413 12.8437L10.1976 7.99998L15.0413 3.15631L13.415 1.52997L8.5713 6.37364L3.72761 1.52995L2.10126 3.15629L6.94495 7.99998Z"
        fill="url(#paint0_linear_1240_2871)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1240_2871"
          x1="14.2281"
          y1="2.34313"
          x2="2.91443"
          y2="13.6568"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#E04300" />
        </linearGradient>
      </defs>
    </Icon>
  )
}
