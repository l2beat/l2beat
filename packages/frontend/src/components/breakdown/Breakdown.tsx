import React from 'react'

import { cn } from '../../utils/cn'

interface BreakdownProps {
  values: BreakdownValue[]
  gap?: number
  className?: string
}

interface BreakdownValue {
  value: number
  className: string
}

export function Breakdown({ values, gap = 2, className }: BreakdownProps) {
  const groups = getBreakdownGroups(values)

  return (
    <div className={cn('flex h-[21px] w-[100px] flex-wrap md:my-0', className)}>
      {groups.map((g, i) => (
        <div
          className={cn(
            'h-full first:rounded-l last:mr-0 last:rounded-r',
            g.className,
          )}
          style={{
            width: `calc(${g.weight}% - ${((groups.length - 1) * gap) / groups.length}px)`,
            marginRight: i !== groups.length - 1 ? `${gap}px` : undefined,
          }}
        />
      ))}
    </div>
  )
}

interface BreakdownGroup {
  weight: number
  className: string
}

function getBreakdownGroups(values: BreakdownValue[]): BreakdownGroup[] {
  const totalValue = values.reduce((sum, v) => sum + v.value, 0)

  if (totalValue === 0)
    return [
      {
        weight: 100,
        className: 'bg-gray-550 dark:bg-gray-650',
      },
    ]

  const groups = values.map((v) => ({
    weight: (v.value / totalValue) * 100,
    className: v.className,
  }))
  console.log('before', groups)

  const toFilterOut = groups.filter((g) => g.weight < 2)
  const filteredGroups = groups.filter((g) => g.weight >= 2)

  const filteredOutSum = toFilterOut.reduce((sum, g) => sum + g.weight, 0)
  for (const filteredGroup of filteredGroups) {
    filteredGroup.weight += filteredOutSum / filteredGroups.length
  }
  console.log('after', filteredGroups)
  return filteredGroups
}
