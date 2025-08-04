import type { WarningWithSentiment } from '@l2beat/config'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { HorizontalSeparator } from '../core/HorizontalSeparator'
import { Square } from '../Square'
import { ValueWithPercentageChange } from '../table/cells/ValueWithPercentageChange'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'
import { Breakdown } from './Breakdown'

interface ValueSecuredBreakdownProps {
  canonical: number
  external: number
  native: number
  className?: string
}

interface ValueSecuredBreakdownTooltipContentProps
  extends ValueSecuredBreakdownProps {
  associatedTokenSymbols?: string[]
  tvsWarnings?: WarningWithSentiment[]
  change?: number
  hideTotal?: boolean
}

export function ValueSecuredBreakdown(props: ValueSecuredBreakdownProps) {
  const values = [
    {
      value: props.canonical,
      className: 'bg-chart-stacked-purple',
    },
    { value: props.native, className: 'bg-chart-stacked-pink' },
    {
      value: props.external,
      className: 'bg-chart-stacked-yellow',
    },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}

export function ValueSecuredBreakdownTooltipContent({
  canonical,
  external,
  native,
  change,
  tvsWarnings,
  hideTotal,
}: ValueSecuredBreakdownTooltipContentProps) {
  const total = canonical + external + native
  if (total === 0) {
    return 'No data'
  }
  const values = [
    {
      title: 'Canonically bridged',
      value: canonical,
      variant: 'canonical',
    },
    {
      title: 'Natively minted',
      value: native,
      variant: 'native',
    },
    {
      title: 'Externally bridged',
      value: external,
      variant: 'external',
    },
  ] as const
  return (
    <div className="space-y-2">
      <div>
        {!hideTotal && (
          <>
            <div className="flex items-center justify-between gap-1">
              <span className="text-heading-16">TVS</span>
              <ValueWithPercentageChange change={change}>
                {formatCurrency(total, 'usd')}
              </ValueWithPercentageChange>
            </div>
            <HorizontalSeparator className="mt-1.5 mb-3" />
          </>
        )}
        <div className="space-y-1">
          {values.map(
            (v, i) =>
              v.value > 0 && (
                <div
                  key={i}
                  className="flex items-center justify-between gap-x-6"
                >
                  <span className="flex items-center gap-1">
                    <Square
                      variant={v.variant}
                      size="small"
                      className="-top-px relative"
                    />
                    <span className="font-medium text-label-value-15">
                      {v.title}
                    </span>
                  </span>
                  <span>
                    <span className="mr-1 font-bold text-label-value-15">
                      {formatCurrency(v.value, 'usd')}
                    </span>
                    <span className="font-medium text-label-value-15 text-secondary">
                      ({formatPercent(v.value / total)})
                    </span>
                  </span>
                </div>
              ),
          )}
        </div>
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
