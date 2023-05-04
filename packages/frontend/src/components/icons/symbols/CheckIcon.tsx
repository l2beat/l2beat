import React from 'react'

import { Icon } from '../Icon'

export function CheckIcon() {
  return (
    <Icon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      fill="none"
      stroke="none"
      className="peer-checked:stroke-black dark:peer-checked:stroke-white"
    >
      <rect
        x="0"
        y="0"
        width="16"
        height="16"
        rx="4"
        ry="4"
        stroke="none"
        className="fill-white dark:fill-black"
      />
      <path
        d="M3.3 8.63L6.23 11.53L12.7 5.07"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}
