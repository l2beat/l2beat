import React, { SVGAttributes } from 'react'
import { Icon } from '../Icon'

export function ShieldBadIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Shield with an X icon" {...props}>
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M15.5,14.09l-1.41,1.41L12,13.42L9.91,15.5 L8.5,14.09L10.59,12L8.5,9.91L9.91,8.5L12,10.59l2.09-2.09l1.41,1.41L13.42,12L15.5,14.09z" />
    </Icon>
  )
}
