import { formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import type { ChartUnit } from '~/components/chart/types'
import type { CompleteTvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { cn } from '~/utils/cn'
import { formatShare, shareOf } from './liquidStakingTvlFormat'
import { inUnit, type TvlLayer } from './liquidStakingTvlLayers'

const OTHER_STAKED_COLOR =
  'color-mix(in oklab, var(--secondary) 50%, transparent)'

export function LiquidStakingTvlRail({
  layers,
  latest,
  unit,
  visibleKeys,
  showAllSelected,
  onToggleLayer,
  onToggleAll,
}: {
  /** The Staked view's layers, whatever the view. */
  layers: TvlLayer[]
  /** In ETH. */
  latest: CompleteTvlBreakdown | undefined
  unit: ChartUnit
  visibleKeys: string[]
  showAllSelected: boolean
  onToggleLayer: (layer: TvlLayer) => void
  onToggleAll: () => void
}) {
  const inChosenUnit = latest && inUnit(latest, unit)
  const protocolLayers = layers.filter((layer) => layer.role === 'protocol')
  const liquidColors = protocolLayers.slice(0, 3).map((layer) => layer.fill)
  const liquidSwatch =
    liquidColors.length > 1
      ? `linear-gradient(135deg, ${liquidColors.join(', ')})`
      : (liquidColors[0] ?? 'var(--brand)')

  return (
    <div className="flex min-w-0 flex-col gap-4 border-divider p-4 max-lg:order-last max-lg:border-t md:px-6 md:py-5 lg:border-r">
      {latest && latest.supply !== null && (
        <div>
          <Heading>ETH supply share</Heading>
          <div
            className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-surface-secondary"
            role="img"
            aria-label={`ETH supply breakdown: ${formatShare(latest.liquid, latest.supply)} liquid staking, ${formatShare(latest.others, latest.supply)} others, ${formatShare(latest.notStaked, latest.supply)} not staked`}
          >
            {protocolLayers.map((layer) => (
              <Segment
                key={layer.key}
                share={shareOf(layer.value(latest), latest.supply)}
                color={layer.fill}
              />
            ))}
            <Segment
              share={shareOf(latest.others, latest.supply)}
              color={OTHER_STAKED_COLOR}
            />
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <ShareRow
              swatch={<Swatch style={{ background: liquidSwatch }} />}
              label="Liquid staking"
              value={inChosenUnit?.liquid}
              unit={unit}
              share={formatShare(latest.liquid, latest.supply)}
            />
            <ShareRow
              swatch={
                <Swatch style={{ backgroundColor: OTHER_STAKED_COLOR }} />
              }
              label="Others"
              value={inChosenUnit?.others}
              unit={unit}
              share={formatShare(latest.others, latest.supply)}
            />
            <ShareRow
              swatch={<Swatch className="bg-surface-secondary" />}
              label="Not staked"
              value={inChosenUnit?.notStaked}
              unit={unit}
              share={formatShare(latest.notStaked, latest.supply)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col border-divider border-t pt-3 lg:flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Heading className="mb-0">Staked breakdown</Heading>
          <button
            type="button"
            onClick={onToggleAll}
            className="cursor-pointer font-medium text-[11px] text-secondary leading-none transition-colors hover:text-primary"
          >
            {showAllSelected ? 'Hide protocols' : 'Show protocols'}
          </button>
        </div>

        <div className="flex flex-col gap-0.5 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-8">
          {layers.map((layer) => (
            <ShareRow
              key={layer.key}
              active={visibleKeys.includes(layer.key)}
              onClick={() => onToggleLayer(layer)}
              swatch={
                <Swatch
                  className={cn(
                    layer.stroke && 'border',
                    layer.strokeDasharray && 'border-dashed',
                  )}
                  style={{
                    backgroundColor: layer.fill,
                    borderColor: layer.stroke,
                  }}
                />
              }
              label={layer.label}
              value={inChosenUnit && layer.value(inChosenUnit)}
              unit={unit}
              share={formatShare(latest && layer.value(latest), latest?.staked)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Heading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 font-semibold text-[11px] text-secondary uppercase leading-none tracking-[0.06em]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Segment({
  share,
  color,
}: {
  share: number | undefined
  color: string
}) {
  if (!share || share <= 0) return null
  return (
    <div
      className="h-full"
      style={{ width: `${share * 100}%`, backgroundColor: color }}
    />
  )
}

function Swatch({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={cn('size-2 shrink-0 rounded-[2px]', className)}
      style={style}
    />
  )
}

function ShareRow({
  swatch,
  label,
  value,
  unit,
  share,
  active = true,
  onClick,
}: {
  swatch: ReactNode
  label: ReactNode
  value: number | null | undefined
  unit: ChartUnit
  share: string | undefined
  active?: boolean
  onClick?: () => void
}) {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-1.5">
        {swatch}
        <span className="truncate font-medium text-label-value-13 text-primary">
          {label}
        </span>
      </span>
      <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap tabular-nums">
        {value != null ? (
          <span className="font-semibold text-label-value-13 text-primary">
            {formatCurrency(value, unit)}
          </span>
        ) : (
          <NoDataBadge />
        )}
        {share !== undefined && (
          <span className="min-w-[38px] text-right font-medium text-label-value-12 text-secondary">
            {share}
          </span>
        )}
      </span>
    </>
  )
  if (!onClick) {
    return (
      <div className="flex items-center justify-between gap-2 py-1">
        {content}
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        '-mx-1.5 flex w-[calc(100%+12px)] cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-secondary',
        !active && 'opacity-40',
      )}
    >
      {content}
    </button>
  )
}
