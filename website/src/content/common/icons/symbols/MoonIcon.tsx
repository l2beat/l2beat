import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MoonIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Moon icon" {...props}>
      <path
        fillRule="evenodd"
        d="M22.2 6.82C20.96 5.69 19.31 5 17.5 5C13.63 5 10.5 8.13 10.5 12C10.5 15.87 13.63 19 17.5 19C19.31 19 20.96 18.31 22.2 17.18C20.35 20.65 16.7 23 12.5 23C6.42 23 1.5 18.08 1.5 12C1.5 5.92 6.42 1 12.5 1C16.7 1 20.35 3.35 22.2 6.82Z"
      />
    </Icon>
  )
}
