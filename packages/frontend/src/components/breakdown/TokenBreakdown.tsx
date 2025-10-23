import type {
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { HorizontalSeparator } from '../core/HorizontalSeparator'
import { Square } from '../Square'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'
import { Breakdown } from './Breakdown'

interface TokenBreakdownProps {
  total: number
  ether: number
  stablecoin: number
  btc: number
  other: number
  rwaPublic: number
  rwaRestricted: number
  className?: string
}

interface TokenBreakdownTooltipContentProps extends TokenBreakdownProps {
  associatedTokens: ProjectAssociatedToken[]
  tvsWarnings: WarningWithSentiment[]
}

export function TokenBreakdown(props: TokenBreakdownProps) {
  const values = [
    {
      value: props.ether,
      className: 'bg-chart-ethereum',
    },
    { value: props.stablecoin, className: 'dark:bg-teal-400 bg-teal-500' },
    { value: props.btc, className: 'bg-orange-400' },
    { value: props.other, className: 'bg-sky-600' },
    { value: props.rwaPublic, className: 'bg-lime-650' },
    { value: props.rwaRestricted, className: 'bg-pink-750' },
  ]

  return (
    <Breakdown values={values} className={cn('opacity-80', props.className)} />
  )
}

export function TokenBreakdownTooltipContent({
  total,
  associated,
  ether,
  stablecoin,
  btc,
  other,
  rwaPublic,
  rwaRestricted,
  associatedTokens,
  tvsWarnings,
}: TokenBreakdownTooltipContentProps & { associated: number }) {
  const values = [
    {
      title: 'ETH & derivatives',
      value: ether,
      variant: 'ether' as const,
    },
    {
      title: 'Stablecoins',
      value: stablecoin,
      variant: 'stable' as const,
    },
    {
      title: 'BTC & derivatives',
      value: btc,
      variant: 'btc' as const,
    },
    { title: 'Other', value: other, variant: 'other' as const },
    { title: 'Public RWAs', value: rwaPublic, variant: 'rwaPublic' as const },
    {
      title: 'Restricted RWAs',
      value: rwaRestricted,
      variant: 'rwaRestricted' as const,
    },
  ]

  return (
    <div className="space-y-2 max-md:max-w-xs">
      {total === 0 ? (
        <span>No data</span>
      ) : (
        <>
          <div className="flex flex-col gap-1">
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
          {associated > 0 && (
            <>
              <HorizontalSeparator />
              <div className="flex items-center justify-between gap-x-6">
                {associatedTokens.map((t) => {
                  return (
                    <span className="flex items-center gap-1" key={t.symbol}>
                      {t.icon && (
                        <img
                          src={t.icon}
                          alt={t.symbol}
                          className="size-4 rounded-full"
                        />
                      )}
                      <span className="font-medium text-label-value-15 leading-0">
                        {t.symbol}
                      </span>
                    </span>
                  )
                })}
                <span>
                  <span className="mr-1 font-bold text-label-value-15">
                    {formatCurrency(associated, 'usd')}
                  </span>
                  <span className="font-medium text-label-value-15 text-secondary">
                    ({formatPercent(associated / total)})
                  </span>
                </span>
              </div>
            </>
          )}
        </>
      )}
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
