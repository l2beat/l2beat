import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function EthereumLineIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      aria-label="Ethereum line icon"
      viewBox="0 0 10 6"
      className={props.className}
    >
      <rect width="10" height="6" fill="#53A2FF" />
    </Icon>
  )
}
