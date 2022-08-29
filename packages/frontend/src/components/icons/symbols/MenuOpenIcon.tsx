import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MenuOpenIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Open menu icon" {...props}>
      <rect x="2" y="5" width="20" height="2" />
      <rect x="2" y="11" width="20" height="2" />
      <rect x="2" y="17" width="20" height="2" />
    </Icon>
  )
}
