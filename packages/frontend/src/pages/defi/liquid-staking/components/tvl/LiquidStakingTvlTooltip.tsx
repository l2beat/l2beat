import { formatCurrency } from '@l2beat/shared-pure'
import type { ChartUnit } from '~/components/chart/types'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { shareOf } from './liquidStakingTvlFormat'
import {
  NOT_STAKED_KEY,
  OTHERS_KEY,
  type TvlScope,
} from './liquidStakingTvlLayers'

/**
 * The day's visible layers. Protocol shares are of the stake, or of the
 * protocols together in Liquid only view, to match the total above them.
 */
export function LiquidStakingTvlTooltip({
  row,
  visibleKeys,
  unit,
  scope,
}: {
  /** In the chosen unit. */
  row: TvlBreakdown
  visibleKeys: string[]
  unit: ChartUnit
  scope: TvlScope
}) {
  const protocols = visibleKeys
    .flatMap((key) => {
      const value = row.projects[key]
      return value != null ? [{ key, value }] : []
    })
    .sort((a, b) => b.value - a.value)
  const others = visibleKeys.includes(OTHERS_KEY) ? row.others : null
  const notStaked = visibleKeys.includes(NOT_STAKED_KEY) ? row.notStaked : null
  if (protocols.length === 0 && others === null && notStaked === null) {
    return null
  }

  const total = scope === 'liquid' ? row.liquid : row.staked
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[220px] flex-col [@media(min-width:600px)]:w-64">
        <ChartTooltipTitle>
          {formatTimestamp(row.timestamp, { mode: 'date' })}
        </ChartTooltipTitle>
        {total !== null && (
          <TooltipHeader
            className="mt-3"
            label={scope === 'liquid' ? 'Liquid staking' : 'ETH staked'}
            value={formatCurrency(total, unit)}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {protocols.map(({ key, value }) => (
            <Row key={key} name={key} value={value} total={total} unit={unit} />
          ))}
          {others !== null && (
            <div className="border-divider border-t pt-2">
              <Row
                name={OTHERS_KEY}
                value={others}
                total={row.staked}
                unit={unit}
              />
            </div>
          )}
          {notStaked !== null && (
            <div className="flex flex-col gap-2 border-divider border-t pt-2">
              <Row
                name={NOT_STAKED_KEY}
                value={notStaked}
                total={row.supply}
                unit={unit}
              />
              {row.supply !== null && (
                <div className="flex justify-between font-medium text-label-value-13 text-secondary tabular-nums">
                  <span>ETH supply</span>
                  <span>{formatCurrency(row.supply, unit)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function Row({
  name,
  value,
  total,
  unit,
}: {
  name: string
  value: number
  /** What the value is a share of. */
  total: number | null
  unit: ChartUnit
}) {
  const share = shareOf(value, total)
  return (
    <ChartTooltipRow name={name} gap="gap-x-3" wrapLabel={false}>
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCurrency(value, unit)}
        </span>
        {share !== undefined && (
          <span className="font-medium text-label-value-13 text-secondary tabular-nums">
            {formatPercent(share)}
          </span>
        )}
      </span>
    </ChartTooltipRow>
  )
}
