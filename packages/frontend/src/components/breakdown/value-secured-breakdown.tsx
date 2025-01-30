import type { WarningWithSentiment } from '@l2beat/config'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { WarningBar, sentimentToWarningBarColor } from '../warning-bar'
import { Breakdown } from './breakdown'

export interface ValueSecuredBreakdownProps {
  canonical: number
  external: number
  native: number
  className?: string
}

export interface ValueSecuredBreakdownTooltipContentProps
  extends ValueSecuredBreakdownProps {
  associatedTokenSymbols?: string[]
  tvsWarnings?: WarningWithSentiment[]
}

export function ValueSecuredBreakdown(props: ValueSecuredBreakdownProps) {
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

export function ValueSecuredBreakdownTooltipContent({
  canonical,
  external,
  native,
  tvsWarnings,
}: ValueSecuredBreakdownTooltipContentProps) {
  const total = canonical + external + native
  if (total === 0) {
    return 'No tokens'
  }
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
                <span className="font-medium">
                  {((v.value / total) * 100).toFixed(2)}%
                </span>
              </div>
            ),
        )}
      </div>
      {tvsWarnings?.map((warning, i) => (
        <WarningBar
          key={`tvs-warning-${i}`}
          icon={RoundedWarningIcon}
          text={warning.value}
          color={sentimentToWarningBarColor(warning.sentiment)}
          // Cell itself is a href.
          // Markdown might contain links - nesting them in a tooltip
          // breaks semantics apart causing significant layout shifts.
          ignoreMarkdown
        />
      ))}
    </div>
  )
}
