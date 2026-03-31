import type { WarningWithSentiment } from '@l2beat/config'
import { cva } from 'class-variance-authority'
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
  additionalTrustAssumptionsPercentage: number | undefined
  className?: string
}

interface ValueSecuredBreakdownTooltipContentProps
  extends ValueSecuredBreakdownProps {
  associatedTokenSymbols?: string[]
  tvsWarnings?: WarningWithSentiment[]
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
    <div className="inline-flex flex-col items-end gap-1">
      <Breakdown
        values={values}
        className={cn('opacity-80', 'h-[3px] w-[200px]', props.className)}
      />
      {props.additionalTrustAssumptionsPercentage !== undefined && (
        <AdditionalTrustAssumptionsText percentage={props.additionalTrustAssumptionsPercentage}/>
      )}
    </div>
  )
}

function AdditionalTrustAssumptionsText({ percentage} : {percentage: number}){
  const sentiment = getAdditionalTrustSentiment(percentage)

  return  <div className="text-right font-medium text-[11px] text-secondary leading-none">
  <span className={additionalTrustPercentVariants({ sentiment })}>
    {formatPercent(percentage)}
  </span>{' '}
  with additional trust assumptions
</div>
  
}

export function ValueSecuredBreakdownTooltipContent({
  canonical,
  external,
  native,
  change,
  additionalTrustAssumptionsPercentage,
  tvsWarnings,
}: ValueSecuredBreakdownTooltipContentProps) {
  const total = canonical + external + native

  if (total === 0) {
    return 'No data'
  }

  const values = [
    {
      title: 'Canonical',
      value: canonical,
      variant: 'canonical',
    },
    {
      title: 'Native',
      value: native,
      variant: 'native',
    },
    {
      title: 'External',
      value: external,
      variant: 'external',
    },
  ] as const
  return (
    <div className="w-max space-y-2">
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-heading-16">TVS</span>
          <ValueWithPercentageChange change={change}>
            {formatCurrency(total, 'usd')}
          </ValueWithPercentageChange>
        </div>
        <HorizontalSeparator className="mt-1.5 mb-3" />
        <div className="space-y-1">
          {values.map(
            (v, i) =>
              v.value > 0 && (
                <div
                  key={i}
                  className="flex items-center justify-between gap-x-3"
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
        {additionalTrustAssumptionsPercentage !== undefined && (
          <AdditionalTrustAssumptionsBanner
            percentage={additionalTrustAssumptionsPercentage}
          />
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

const additionalTrustBannerVariants = cva(
  'mt-2 w-full rounded-md px-2.5 py-2',
  {
    variants: {
      sentiment: {
        good: 'bg-positive/15 dark:bg-positive/20',
        warning: 'bg-warning/15 dark:bg-warning/20',
        bad: 'bg-negative/10 dark:bg-negative/20',
      },
    },
  },
)

const additionalTrustPercentVariants = cva('font-bold', {
  variants: {
    sentiment: {
      good: 'text-positive',
      warning: 'text-warning',
      bad: 'text-negative',
    },
  },
})

type AdditionalTrustSentiment = 'good' | 'warning' | 'bad'
function getAdditionalTrustSentiment(percentage: number): AdditionalTrustSentiment {
  if (percentage <= 0.2) {
    return 'good'
  }
  if (percentage >= 0.8) {
    return 'bad'
  }
  return 'warning'
}

function AdditionalTrustAssumptionsBanner({ percentage }: { percentage: number }) {
  const sentiment = getAdditionalTrustSentiment(percentage)
  return (
    <div className={additionalTrustBannerVariants({sentiment})}>
      <p className="text-right text-label-value-13 text-primary leading-snug">
        <span className={additionalTrustPercentVariants({sentiment})}>
          {formatPercent(percentage)}
        </span>{' '}
        <span className="font-normal">
          TVS with additional trust assumptions.
        </span>
      </p>
    </div>
  )
}
