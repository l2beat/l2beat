import React, { SVGAttributes } from 'react'
export function ArcologyIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="20.3"
      version="1.1"
      viewBox="0 0 24 20.3"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="arcology logo"
      {...props}
    >
      <defs>
        <clipPath id="clipPath14">
          <path d="m0 0h360v360h-360z" />
        </clipPath>
        <clipPath id="clipPath30">
          <path d="m0 360h360v-360h-360z" />
        </clipPath>
      </defs>
      <g
        transform="matrix(.58626 0 0 -.62978 -88.678 153.04)"
        clipPath="url(#clipPath14)"
      >
        <g transform="matrix(.64364 0 0 .64364 192.2 210.77)">
          <path d="m0 0h-45.589l3.002 6.599h39.024z" fill="#ff6100" />
        </g>
        <g transform="matrix(.64364 0 0 .64364 60.285 86.596)">
          <g clipPath="url(#clipPath30)">
            <g transform="translate(168.46 243)">
              <path d="m0 0-27.116-50.079h9.301l6.368 12.091h0.012l3.851 7.299h-1e-3l2.829 5.358 0.154 0.291 9.252 17.527 8.987-17.025 0.208-0.394 3.039-5.757h-1e-3l10.231-19.39h9.373l-27.044 50.079z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
