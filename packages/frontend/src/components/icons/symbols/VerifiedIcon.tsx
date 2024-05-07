import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function VerifiedIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon width="20" height="20" viewBox="0 0 20 20" {...props}>
      <g clipPath="url(#clip0_183_1173)">
        <path
          d="M10.0002 0.833435L11.8777 2.92885L14.5835 2.08344L15.1939 4.80635L17.9168 5.41677L17.0835 8.1226L19.1668 10.0001L17.0835 11.8776L17.9168 14.5834L15.1939 15.1939L14.5835 17.9168L11.8777 17.0714L10.0002 19.1668L8.12266 17.0714L5.41683 17.9168L4.80641 15.1939L2.0835 14.5834L2.91683 11.8776L0.833496 10.0001L2.91683 8.1226L2.0835 5.41677L4.80641 4.80635L5.41683 2.08344L8.12266 2.92885L10.0002 0.833435Z"
          fill="#549C00"
        />
        <path
          d="M14.4176 6.08429L8.75007 11.7497L6.4159 9.41721L5.25049 10.5826L8.75007 14.0839L15.5826 7.24971L14.4176 6.08429Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_183_1173">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </Icon>
  )
}
