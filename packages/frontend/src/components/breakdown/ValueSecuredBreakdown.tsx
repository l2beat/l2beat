import type { WarningWithSentiment } from '@l2beat/config'
import { cva, type VariantProps } from 'class-variance-authority'
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
  customCanonical: number
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
  const total = props.canonical + props.external + props.native
  const additionalTrustAssumptions = props.external + props.customCanonical
  const trustRatio = total > 0 ? additionalTrustAssumptions / total : 0
  const trustBand = total > 0 ? getAdditionalTrustBand(trustRatio) : 'mid'
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
    <div className="inline-flex flex-col gap-1">
      <Breakdown
        values={values}
        className={cn('opacity-80', props.className)}
      />
      {total > 0 && (
        <div className="font-medium text-[11px] text-secondary leading-none">
          <span className={additionalTrustPercentVariants({ band: trustBand })}>
            {formatAdditionalTrustSharePercent(trustRatio)}
          </span>{' '}
          with additional trust assumptions
        </div>
      )}
    </div>
  )
}

export function ValueSecuredBreakdownTooltipContent({
  canonical,
  customCanonical,
  external,
  native,
  change,
  tvsWarnings,
  hideTotal,
}: ValueSecuredBreakdownTooltipContentProps) {
  const total = canonical + external + native
  const additionalTrustAssumptions = external + customCanonical
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
        {total > 0 && (
          <AdditionalTrustAssumptionsBanner
            ratio={additionalTrustAssumptions / total}
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

function formatAdditionalTrustSharePercent(ratio: number) {
  const percent = ratio * 100
  if (percent >= 1000) {
    return '>1K%'
  }
  return `${Math.round(percent)}%`
}

const additionalTrustBannerVariants = cva(
  'mt-2 w-full rounded-md px-2.5 py-2',
  {
    variants: {
      band: {
        low: 'bg-positive/15 dark:bg-positive/20',
        mid: 'bg-warning/15 dark:bg-warning/20',
        high: 'bg-negative/10 dark:bg-negative/20',
      },
    },
    defaultVariants: {
      band: 'mid',
    },
  },
)

const additionalTrustPercentVariants = cva('font-bold', {
  variants: {
    band: {
      low: 'text-positive',
      mid: 'text-warning',
      high: 'text-negative',
    },
  },
  defaultVariants: {
    band: 'mid',
  },
})

type AdditionalTrustBand = NonNullable<
  VariantProps<typeof additionalTrustBannerVariants>['band']
>

function getAdditionalTrustBand(ratio: number): AdditionalTrustBand {
  const rounded = Math.round(ratio * 100)
  if (rounded <= 20) {
    return 'low'
  }
  if (rounded >= 80) {
    return 'high'
  }
  return 'mid'
}

function AdditionalTrustAssumptionsBanner({ ratio }: { ratio: number }) {
  const band = getAdditionalTrustBand(ratio)
  return (
    <div className={additionalTrustBannerVariants({ band })}>
      <p className="text-label-value-13 text-primary leading-snug">
        <span className={additionalTrustPercentVariants({ band })}>
          {formatAdditionalTrustSharePercent(ratio)}
        </span>{' '}
        <span className="font-normal">
          TVS with additional trust assumptions.
        </span>
      </p>
    </div>
  )
}
