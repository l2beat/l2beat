import React from 'react'

import { cn } from '../../utils/cn'

interface BreakdownProps {
  values: BreakdownValue[]
  height?: number
  width?: number
  minBarWidth?: number
  barGap?: number
  className?: string
}

interface BreakdownValue {
  value: number
  className: string
}

export function Breakdown({
  values,
  height = 21,
  width = 100,
  minBarWidth = 2,
  barGap = 2,
  className,
}: BreakdownProps) {
  return (
    <svg
      className={cn('w-max overflow-hidden rounded', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {getGradientGroups({ values, width, height, minBarWidth, barGap }).map(
        (g, i) => (
          <rect
            key={i}
            x={g.offset}
            y="0"
            width={g.size}
            height={height}
            className={g.className}
          />
        ),
      )}
    </svg>
  )
}

interface GradientGroup {
  weight: number
  className: string
  offset: number
  size: number
}

function getGradientGroups({
  values,
  width,
  minBarWidth,
  barGap,
}: {
  values: BreakdownValue[]
  height: number
  width: number
  minBarWidth: number
  barGap: number
}): GradientGroup[] {
  const totalValue = values.reduce((sum, v) => sum + v.value, 0)

  if (totalValue === 0)
    return [
      {
        weight: 1,
        className: 'fill-gray-550 dark:fill-gray-650',
        offset: 0,
        size: width,
      },
    ]

  const groups = values
    .map((v) => ({
      weight: v.value / totalValue,
      className: v.className,
    }))
    .filter((x) => x.weight >= 0.005)

  const gaps = groups.length - 1
  const sizedGroups = groups.map((g) => ({
    ...g,
    size: Math.max(minBarWidth, Math.ceil(g.weight * (width - gaps * barGap))),
  }))
  const total = sizedGroups.reduce((sum, g) => sum + g.size, 0)
  const difference = total - (width - gaps * barGap)
  let largest = sizedGroups[0]
  for (const group of sizedGroups) {
    if (group.size > largest.size) {
      largest = group
    }
  }
  largest.size -= difference
  let offset = 0
  const withOffset = sizedGroups.map((g) => {
    const result = { ...g, offset: offset }
    offset += g.size + barGap
    return result
  })
  return withOffset
}
