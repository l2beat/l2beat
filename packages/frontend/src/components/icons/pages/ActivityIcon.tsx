import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ActivityIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Activity icon" {...props}>
      <path
        d="M0 12C0 5.3736 5.3736 0 12 0C18.6264 0 24 5.3736 24 12C24 18.6264 18.6264 24 12 24C5.3736 24 0 18.6264 0 12Z"
        fill="#5855FF"
      />
      <path
        d="M13.7998 5.3999V8.3999H4.7998V10.7999H19.1998L13.7998 5.3999Z"
        fill="white"
      />
      <path
        d="M10.1998 18.6V15.6H19.1998V13.2H4.7998L10.1998 18.6Z"
        fill="white"
      />
    </Icon>
  )
}
