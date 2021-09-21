import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function FinanceIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Finance icon" {...props}>
      <path d="M3 14V11L9 6.00001L14 8.00001L18.2739 4.33667L19.7312 6.08754L14 11L9 9.00001L3 14Z" />
      <path d="M3 15H6V22H3V15Z" />
      <path d="M8 12H11V22H8V12Z" />
      <rect x="13" y="13" width="3" height="9" />
      <path d="M18 9H21V22H18V9Z" />
      <path d="M16 3H21V8L16 3Z" />
    </Icon>
  )
}
