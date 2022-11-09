import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function BulletIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      viewBox="0 0 20 20"
      width="16"
      height="20"
      aria-label="Bullet point icon"
      {...props}
    >
      <circle cx="10" cy="10" r="2.75" />
    </Icon>
  )
}
