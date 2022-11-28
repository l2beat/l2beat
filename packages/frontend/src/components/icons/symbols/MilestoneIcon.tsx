import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MilestoneIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Milestone icon" {...props}>
      <rect
        x="9.89941"
        y="1.41421"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45 9.89941 1.41421)"
        stroke-width="2"
      />
    </Icon>
  )
}
