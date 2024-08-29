import { type WarningWithSentiment } from '@l2beat/config'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { WarningBar } from '../warning-bar'
import { Breakdown } from './breakdown'

export interface TokenTypeBreakdownProps {
  canonical: number
  external: number
  native: number
  className?: string
}

export interface TokenTypeBreakdownTooltipContentProps
  extends TokenTypeBreakdownProps {
  associatedTokenSymbols?: string[]
  tvlWarnings?: WarningWithSentiment[]
}

export function TokenTypeBreakdown(props: TokenTypeBreakdownProps) {
  const values = [
    {
      value: props.canonical,
      className: 'bg-purple-100',
    },
    {
      value: props.external,
      className: 'bg-yellow-200',
    },
    { value: props.native, className: 'bg-pink-100' },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}

export function TokenTypeBreakdownTooltipContent({
  canonical,
  external,
  native,
  tvlWarnings,
}: TokenTypeBreakdownTooltipContentProps) {
  const values = [
    {
      title: 'Canonical',
      value: canonical,
      className: 'bg-purple-100 dark:bg-purple-100',
    },
    {
      title: 'External',
      value: external,
      className: 'bg-yellow-200 dark:bg-yellow-200',
    },
    {
      title: 'Native',
      value: native,
      className: 'bg-pink-100 dark:bg-pink-100',
    },
  ]
  const total = canonical + external + native
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
                    className={cn(
                      'size-3 rounded bg-rose-500 dark:bg-rose-700',
                      v.className,
                    )}
                  ></div>
                  <span>{v.title}</span>
                </span>
                <span className="font-semibold">
                  {((v.value / total) * 100).toFixed(2)}%
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
