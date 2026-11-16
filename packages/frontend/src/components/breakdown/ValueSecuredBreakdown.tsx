import type { WarningWithSentiment } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import {
  TooltipHeader,
  TooltipRow,
  TooltipShare,
} from '~/components/core/tooltip/TooltipParts'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { NoDataBanner } from '../NoDataBanner'
import { PercentChange } from '../PercentChange'
import { Square } from '../Square'
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
  syncWarning: string | undefined
  change?: number
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
    <Breakdown
      values={values}
      className={cn('opacity-80', 'h-[3px] w-[197px]', props.className)}
    />
  )
}

export function ValueSecuredBreakdownTooltipContent({
  canonical,
  external,
  native,
  change,
  tvsWarnings,
  syncWarning,
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
    <div className="flex flex-col gap-2">
      <TooltipHeader
        label="TVS"
        value={
          <>
            {formatCurrency(total, 'usd')}
            {change !== undefined && (
              <PercentChange
                value={change}
                className="ml-1.5 min-w-0 font-medium text-label-value-14"
              />
            )}
          </>
        }
      />
      {syncWarning && <NoDataBanner content={syncWarning} />}
      {values.map(
        (v) =>
          v.value > 0 && (
            <TooltipRow
              key={v.variant}
              indicator={<Square variant={v.variant} size="small" />}
              label={v.title}
            >
              {formatCurrency(v.value, 'usd')}{' '}
              <TooltipShare value={v.value / total} />
            </TooltipRow>
          ),
      )}
      {tvsWarnings?.map((warning, i) => (
        <WarningBar
          key={`tvs-warning-${i}`}
          compact
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
