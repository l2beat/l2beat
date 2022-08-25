import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MenuCloseIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Close menu icon" {...props}>
      <rect
        x="5.63599"
        y="4.22182"
        width="20"
        height="2"
        transform="rotate(45 5.63599 4.22182)"
      />
      <rect
        x="4.2218"
        y="18.364"
        width="20"
        height="2"
        transform="rotate(-45 4.2218 18.364)"
      />
    </Icon>
  )
}
