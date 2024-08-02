import React from 'react'
import { cn } from '~/utils/cn'
import { Breakdown } from './breakdown'
import { type WarningWithSentiment } from '@l2beat/config'
import { WarningBar } from '../warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'

export interface TokenBreakdownProps {
  associated: number
  ether: number
  stablecoin: number
  other: number
  className?: string
}

export interface TokenBreakdownTooltipContentProps extends TokenBreakdownProps {
  associatedTokenSymbols?: string[]
  tvlWarnings?: WarningWithSentiment[]
}

export function TokenBreakdown(props: TokenBreakdownProps) {
  const values = [
    {
      value: props.associated,
      className: 'dark:bg-rose-700 bg-rose-500',
    },
    {
      value: props.ether,
      className: 'dark:bg-green-200 bg-green-900',
    },
    { value: props.stablecoin, className: 'dark:bg-teal-400 bg-teal-500' },
    { value: props.other, className: 'bg-sky-600' },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}

export function TokenBreakdownTooltipContent({
  associated,
  ether,
  stablecoin,
  other,
  associatedTokenSymbols,
  tvlWarnings,
  className,
}: TokenBreakdownTooltipContentProps) {
  const values = [
    {
      title: associatedTokenSymbols?.join(', ') ?? 'Associated',
      value: associated,
      className: 'dark:bg-rose-700 bg-rose-500',
    },
    {
      title: 'Ether',
      value: ether,
      className: 'dark:bg-green-200 bg-green-900',
    },
    {
      title: 'Stablecoins',
      value: stablecoin,
      className: 'dark:bg-teal-400 bg-teal-500',
    },
    { title: 'Other', value: other, className: 'bg-sky-600' },
  ]
  const total = associated + ether + stablecoin + other
  return (
    <div className="space-y-2">
      <div>
        {values.map(
          (v, i) =>
            v.value > 0 && (
              <div
                key={i}
                className="flex items-center justify-between gap-x-6"
              >
                <span className="flex items-center gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className="size-3 rounded bg-rose-500 dark:bg-rose-700"
                  ></div>
                  <span>{v.title}</span>
                </span>
                <span className="font-semibold">
                  {(v.value / total).toFixed(2)}%
                </span>
              </div>
            ),
        )}
      </div>
      {tvlWarnings?.map((warning, i) => (
        <WarningBar
          key={`tvl-warning-${i}`}
          icon={RoundedWarningIcon}
          text={warning.content}
          color={warning.sentiment === 'warning' ? 'yellow' : 'red'}
          // Cell itself is a href.
          // Markdown might contain links - nesting them in a tooltip
          // breaks semantics apart causing significant layout shifts.
          ignoreMarkdown
        />
      ))}
    </div>
  )
}
