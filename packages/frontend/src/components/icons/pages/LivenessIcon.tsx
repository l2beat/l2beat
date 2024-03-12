import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function LivenessIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <g clipPath="url(#clip0_78_28)">
        <path
          d="M0.5 2.22222C0.5 1 1.5 0 2.72222 0H18.2778C19.5 0 20.5 1 20.5 2.22222V17.7778C20.5 19 19.5 20 18.2778 20H2.72222C1.5 20 0.5 19 0.5 17.7778V2.22222Z"
          fill="#455A64"
        />
        <path
          d="M11.5 19.2223L9.27778 7.0556L7.11111 15.7778L5.94444 10.3889L5.88889 10.5556H0.5V9.44449H5.11111L6.16667 6.27782L7.22222 10.8889L9.5 1.83337L11.7222 14.1112L13.8333 6.22226L15.1111 10.7223L15.7222 9.44449H20.5V10.5556H16.3889L14.7778 13.7223L13.8333 10.4445L11.5 19.2223Z"
          fill="#AEEA00"
        />
      </g>
      <defs>
        <clipPath id="clip0_78_28">
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
