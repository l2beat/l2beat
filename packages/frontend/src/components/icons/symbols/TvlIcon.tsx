import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function TvlIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Tvl icon" {...props}>
      <path
        d="M24 20.6667H0V12.6667L6.66667 2.66667L16 7.33333L24 0V20.6667Z"
        fill="#7E41CC"
      />
      <path
        d="M24 23.9999H0V17.3333L6.66667 11.9999L16 13.3333L24 7.33325V23.9999Z"
        fill="#FF46C0"
      />
    </Icon>
  )
}
