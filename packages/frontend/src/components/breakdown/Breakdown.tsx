import { assert } from '@l2beat/shared-pure'

import { cn } from '~/utils/cn'
import { unifyPercentagesAsIntegers } from '~/utils/math'

interface BreakdownProps {
  values: BreakdownValue[]
  gap?: number
  className?: string
}

interface BreakdownValue {
  value: number
  className: string
}

export function Breakdown({ values, gap = 1, className }: BreakdownProps) {
  const groups = getBreakdownGroups(values)

  return (
    <div className={cn('flex h-[21px] w-[100px] md:my-0', className)}>
      {groups.map((g, i) => (
        <div
          key={`breakdown-group-${i}`}
          className={cn(
            'h-full first:rounded-l last:mr-0 last:rounded-r',
            g.className,
          )}
          style={{
            width: `${g.weight}%`,
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

  const toFilterOut = groups.filter((g) => g.weight < 2)
  const filteredGroups = groups.filter((g) => g.weight >= 2)

  const filteredOutSum = toFilterOut.reduce((sum, g) => sum + g.weight, 0)
  for (const filteredGroup of filteredGroups) {
    filteredGroup.weight += filteredOutSum / filteredGroups.length
  }

  if (filteredGroups.length < 2) {
    return filteredGroups
  }

  const weights = unifyPercentagesAsIntegers(
    filteredGroups.map((g) => g.weight),
  )
  return filteredGroups.map((f, i) => {
    const weight = weights[i]
    assert(weight !== undefined, 'Weights should not be undefined')
    return {
      weight,
      className: f.className,
    }
  })
}
