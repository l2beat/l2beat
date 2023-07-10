import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function SummaryIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Summary" {...props}>
      <g clipPath="url(#clip0_4_3317)">
        <path
          d="M11.9575 1.39722C6.07957 1.39722 1.31488 6.16191 1.31488 12.0398C1.31488 17.9177 6.07957 22.6824 11.9575 22.6824C14.8182 22.6824 17.4097 21.5479 19.3221 19.7115L11.9575 12.0398V1.39722Z"
          fill="#50E6FF"
        />
        <path
          d="M22.6001 12.0398C22.6001 6.16191 17.8354 1.39722 11.9575 1.39722V12.0398H22.6001Z"
          fill="#0078D4"
        />
        <path
          d="M22.6001 12.0398H11.9575L19.3221 19.7115C21.3389 17.7746 22.6001 15.057 22.6001 12.0398Z"
          fill="#00A5FF"
        />
        <path
          d="M16.9038 0.0786133L11.9492 12.0399L23.9997 7.33446C22.762 4.16581 20.2944 1.4833 16.9038 0.0786133Z"
          fill="#D864FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_4_3317">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  )
}
