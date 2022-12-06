import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function MilestoneIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon aria-label="Milestone icon" {...props}>
      <rect
        className="fill-green-200 stroke-green-400 dark:fill-green-800 dark:stroke-green-500"
        x="9.89941"
        y="1.41421"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45 9.89941 1.41421)"
        strokeWidth="2"
      />
    </Icon>
  )
}
