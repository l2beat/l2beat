import type {
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import {
  TooltipRow,
  TooltipShare,
} from '~/components/core/tooltip/TooltipParts'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { HorizontalSeparator } from '../core/HorizontalSeparator'
import { Square } from '../Square'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'
import { Breakdown } from './Breakdown'
import { TVS_ASSET_CATEGORY_LABELS } from './tvsAssetCategories'

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
      title: TVS_ASSET_CATEGORY_LABELS.ether,
      value: ether,
      variant: 'ether' as const,
    },
    {
      title: TVS_ASSET_CATEGORY_LABELS.stablecoin,
      value: stablecoin,
      variant: 'stable' as const,
    },
    {
      title: TVS_ASSET_CATEGORY_LABELS.btc,
      value: btc,
      variant: 'btc' as const,
    },
    {
      title: TVS_ASSET_CATEGORY_LABELS.other,
      value: other,
      variant: 'other' as const,
    },
    {
      title: TVS_ASSET_CATEGORY_LABELS.rwaPublic,
      value: rwaPublic,
      variant: 'rwaPublic' as const,
    },
    {
      title: TVS_ASSET_CATEGORY_LABELS.rwaRestricted,
      value: rwaRestricted,
      variant: 'rwaRestricted' as const,
    },
  ]

  return (
    <div className="flex flex-col gap-2 max-md:max-w-xs">
      {total === 0 ? (
        <span>No data</span>
      ) : (
        <>
          {values.map(
            (v) =>
              v.value > 0 && (
                <TooltipRow
                  key={v.variant}
                  gap="gap-x-6"
                  indicator={<Square variant={v.variant} size="small" />}
                  label={v.title}
                >
                  {formatCurrency(v.value, 'usd')}{' '}
                  <TooltipShare value={v.value / total} />
                </TooltipRow>
              ),
          )}
          {associated > 0 && (
            <>
              <HorizontalSeparator />
              <TooltipRow
                gap="gap-x-6"
                label={
                  <span className="flex items-center gap-1.5">
                    {associatedTokens.map((t) => (
                      <span className="flex items-center gap-1" key={t.symbol}>
                        {t.icon && (
                          <img
                            src={t.icon}
                            alt={t.symbol}
                            className="size-4 rounded-full"
                          />
                        )}
                        {t.symbol}
                      </span>
                    ))}
                  </span>
                }
              >
                {formatCurrency(associated, 'usd')}{' '}
                <TooltipShare value={associated / total} />
              </TooltipRow>
            </>
          )}
        </>
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
