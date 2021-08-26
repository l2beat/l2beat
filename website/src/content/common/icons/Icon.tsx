import React, { SVGAttributes } from 'react'

export function Icon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="var(--text)"
      role="img"
      {...props}
    />
  )
}
