import React from 'react'

import { RoundedWarningIcon } from './icons'
import { WarningBar } from './project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip/Tooltip'

export interface TokenBreakdownProps {
  warning?: string
  warningSeverity: 'warning' | 'bad'
  label: React.ReactNode
  empty: boolean
  associated: number
  ether: number
  stable: number
  other: number
}

export function TokenBreakdown(props: TokenBreakdownProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <svg
          className="overflow-hidden rounded opacity-80"
          width="100"
          height="21"
          viewBox="0 0 100 21"
          fill="none"
        >
          {getGradientGroups(props).map((g, i) => (
            <rect
              key={i}
              x={g.offset}
              y="0"
              width={g.size}
              height="21"
              className={g.className}
            />
          ))}
        </svg>
        {props.warning && (
          <>
            {props.warningSeverity === 'warning' && (
              <RoundedWarningIcon className="fill-yellow-700 dark:fill-yellow-300" />
            )}
            {props.warningSeverity === 'bad' && (
              <RoundedWarningIcon className="fill-red-700 dark:fill-red-300" />
            )}
          </>
        )}
      </TooltipTrigger>
      <TooltipContent>
        {props.label}
        {props.warning && (
          <WarningBar
            className="mt-2"
            text={props.warning}
            color={props.warningSeverity === 'warning' ? 'yellow' : 'red'}
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

const GAP_SIZE = 2
const MIN_SIZE = 2

function getGradientGroups(breakdown: TokenBreakdownProps) {
  if (breakdown.empty) {
    return []
  }
  const groups = [
    {
      weight: breakdown.associated,
      className: 'dark:fill-rose-700 fill-rose-500',
    },
    {
      weight: breakdown.ether,
      className: 'dark:fill-green-200 fill-green-900',
    },
    { weight: breakdown.stable, className: 'dark:fill-teal-400 fill-teal-500' },
    { weight: breakdown.other, className: 'fill-sky-600' },
  ].filter((x) => x.weight >= 0.005)
  const gaps = groups.length - 1
  const sizedGroups = groups.map((g) => ({
    ...g,
    size: Math.max(MIN_SIZE, Math.ceil(g.weight * (100 - gaps * GAP_SIZE))),
  }))
  const total = sizedGroups.reduce((sum, g) => sum + g.size, 0)
  const difference = total - (100 - gaps * GAP_SIZE)
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
    offset += g.size + GAP_SIZE
    return result
  })
  return withOffset
}
