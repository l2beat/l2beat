import { formatCurrency } from '@l2beat/shared-pure'
import type { ChartUnit } from '~/components/chart/types'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatTimestamp } from '~/utils/dates'
import { formatShare } from './liquidStakingTvlFormat'
import { type TvlLayer, type TvlScope, VIEWS } from './liquidStakingTvlLayers'

export function LiquidStakingTvlTooltip({
  row,
  layers,
  unit,
  scope,
}: {
  /** In the chosen unit. */
  row: TvlBreakdown
  /** The layers the chart draws. */
  layers: TvlLayer[]
  unit: ChartUnit
  scope: TvlScope
}) {
  const drawn = layers.flatMap((layer) => {
    const value = layer.value(row)
    return value !== null ? [{ key: layer.key, role: layer.role, value }] : []
  })
  if (drawn.length === 0) return null
  const protocols = drawn
    .filter(({ role }) => role === 'protocol')
    .sort((a, b) => b.value - a.value)
  const others = drawn.find(({ role }) => role === 'others')
  const notStaked = drawn.find(({ role }) => role === 'notStaked')

  const base = VIEWS[scope].protocolShareOf
  const total = base.value(row)
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[220px] flex-col [@media(min-width:600px)]:w-64">
        <ChartTooltipTitle>
          {formatTimestamp(row.timestamp, { mode: 'date' })}
        </ChartTooltipTitle>
        {total !== null && (
          <TooltipHeader
            className="mt-3"
            label={base.label}
            value={formatCurrency(total, unit)}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {protocols.map(({ key, value }) => (
            <Row key={key} name={key} value={value} total={total} unit={unit} />
          ))}
          {others && (
            <div className="border-divider border-t pt-2">
              <Row
                name={others.key}
                value={others.value}
                total={row.staked}
                unit={unit}
              />
            </div>
          )}
          {notStaked && (
            <div className="flex flex-col gap-2 border-divider border-t pt-2">
              <Row
                name={notStaked.key}
                value={notStaked.value}
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
  const share = formatShare(value, total)
  return (
    <ChartTooltipRow name={name} gap="gap-x-3" wrapLabel={false}>
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCurrency(value, unit)}
        </span>
        {share !== undefined && (
          <span className="font-medium text-label-value-13 text-secondary tabular-nums">
            {share}
          </span>
        )}
      </span>
    </ChartTooltipRow>
  )
}
