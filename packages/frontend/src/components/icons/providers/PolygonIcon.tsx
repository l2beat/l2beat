import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function PolygonIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="polygon logo" {...props}>
      <path d="" className="fill-[#1c60ff] dark:fill-current" />
    </Icon>
  )
}
