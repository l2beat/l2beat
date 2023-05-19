import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function LoopringIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="loopring logo" {...props}>
      <path
        d="M17.4,11.6H30v.1l-19.7,12,9.8-7.8ZM10,0V23.9l-10-8Z"
        className="fill-[#1c60ff] dark:fill-current"
      />
    </Icon>
  )
}
