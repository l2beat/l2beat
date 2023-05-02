import React, { SVGAttributes } from 'react'

import { Icon } from '../Icon'

export function SearchIcon(props: SVGAttributes<SVGElement>) {
  return (
    <Icon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      stroke="var(--text)"
      aria-label="Search icon"
      {...props}
    >
      <path d="M6.72003 0.959961C3.71203 0.959961 1.28003 3.39196 1.28003 6.39996C1.28003 9.40796 3.71203 11.84 6.72003 11.84C9.72803 11.84 12.16 9.40796 12.16 6.39996C12.16 3.39196 9.72803 0.959961 6.72003 0.959961ZM6.72003 10.56C4.41603 10.56 2.56003 8.70396 2.56003 6.39996C2.56003 4.09596 4.41603 2.23996 6.72003 2.23996C9.02403 2.23996 10.88 4.09596 10.88 6.39996C10.88 8.70396 9.02403 10.56 6.72003 10.56Z" />
      <path
        d="M10.353 10.353L14.24 14.24"
        strokeWidth="1.6"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </Icon>
  )
}
