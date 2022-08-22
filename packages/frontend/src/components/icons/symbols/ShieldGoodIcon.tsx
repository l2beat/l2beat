import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function ShieldGoodIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Shield with a tick icon" {...props}>
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M10.94,15.54L7.4,12l1.41-1.41l2.12,2.12 l4.24-4.24l1.41,1.41L10.94,15.54z" />
    </Icon>
  )
}
