import React from 'react'

interface SquareProps {
  height: number
  width: number
  className?: string
}

export function Square({ height, width, className }: SquareProps) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Square icon"
      className={className}
      height={height}
      width={width}
    >
      <rect x="0" y="0" width={width} height={height} />
    </svg>
  )
}
