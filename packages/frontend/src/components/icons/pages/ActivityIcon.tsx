import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ActivityIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <g clipPath="url(#clip0_78_113)">
        <path
          d="M20.5 17.2222H0.5V10.5556L6.05556 2.22222L13.8333 6.11111L20.5 0V17.2222Z"
          fill="#3756FD"
        />
        <path
          d="M20.5 20H0.5V14.4444L6.05556 10L13.8333 11.1111L20.5 6.11111V20Z"
          fill="#FF46C0"
        />
      </g>
      <defs>
        <clipPath id="clip0_78_113">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </Icon>
  )
}
