import React, { type SVGAttributes } from 'react'

export function LoopringIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="loopring logo"
      {...props}
    >
      <path
        d="M17.4,11.6H30v.1l-19.7,12,9.8-7.8ZM10,0V23.9l-10-8Z"
        className="fill-[#1c60ff] dark:fill-current"
      />
    </svg>
  )
}
