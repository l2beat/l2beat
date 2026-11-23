import type { ReactNode } from 'react'
import type { ChartUnit } from '~/components/chart/types'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { LiquidStakingChartSeries } from '../LiquidStakingLineChart'
import { formatAmount, shareOf } from './liquidStakingTvlFormat'
import {
  inUnit,
  OTHERS_COLOR,
  OTHERS_KEY,
  OTHERS_STROKE,
} from './liquidStakingTvlLayers'

const OTHER_STAKED_COLOR =
  'color-mix(in oklab, var(--secondary) 50%, transparent)'

/**
 * The latest day split up: all ETH by whether and how it is staked, then the
 * stake by protocol, each row toggling its layer of the chart.
 */
export function LiquidStakingTvlRail({
  projectSeries,
  latest,
  unit,
  visibleKeys,
  showAllSelected,
  onToggleKey,
  onToggleAll,
}: {
  projectSeries: LiquidStakingChartSeries[]
  /** In ETH. */
  latest: TvlBreakdown | undefined
  unit: ChartUnit
  visibleKeys: string[]
  showAllSelected: boolean
  onToggleKey: (key: string) => void
  onToggleAll: () => void
}) {
  const inChosenUnit = latest && inUnit(latest, unit)
  const liquidColors = projectSeries.slice(0, 3).map((series) => series.color)
  const liquidSwatch =
    liquidColors.length > 1
      ? `linear-gradient(135deg, ${liquidColors.join(', ')})`
      : (liquidColors[0] ?? 'var(--brand)')

  return (
    <div className="flex min-w-0 flex-col gap-4 border-divider p-4 max-lg:order-last max-lg:border-t md:px-6 md:py-5 lg:border-r">
      {latest?.supply && latest.notStaked !== null && inChosenUnit && (
        <div>
          <Heading>ETH supply share</Heading>
          <div
            className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-surface-secondary"
            role="img"
            aria-label={`ETH supply breakdown: ${formatShare(latest.liquid, latest.supply)} liquid staking, ${formatShare(latest.others, latest.supply)} other staked, ${formatShare(latest.notStaked, latest.supply)} unstaked`}
          >
            {projectSeries.map((series) => (
              <Segment
                key={series.key}
                share={shareOf(latest.projects[series.key], latest.supply)}
                color={series.color}
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
              value={formatAmount(inChosenUnit.liquid, unit)}
              share={formatShare(latest.liquid, latest.supply)}
            />
            <ShareRow
              swatch={
                <Swatch style={{ backgroundColor: OTHER_STAKED_COLOR }} />
              }
              label="Other staked"
              value={formatAmount(inChosenUnit.others, unit)}
              share={formatShare(latest.others, latest.supply)}
            />
            <ShareRow
              swatch={<Swatch className="bg-surface-secondary" />}
              label="Unstaked"
              value={formatAmount(inChosenUnit.notStaked, unit)}
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
            {showAllSelected ? 'Hide all' : 'Show all'}
          </button>
        </div>

        <div className="flex flex-col gap-0.5 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-8">
          {projectSeries.map((series) => (
            <ShareRow
              key={series.key}
              active={visibleKeys.includes(series.key)}
              onClick={() => onToggleKey(series.key)}
              swatch={<Swatch style={{ backgroundColor: series.color }} />}
              label={series.label}
              value={formatAmount(inChosenUnit?.projects[series.key], unit)}
              share={formatShare(latest?.projects[series.key], latest?.staked)}
            />
          ))}
          <ShareRow
            active={visibleKeys.includes(OTHERS_KEY)}
            onClick={() => onToggleKey(OTHERS_KEY)}
            swatch={
              <Swatch
                className="border border-dashed"
                style={{
                  backgroundColor: OTHERS_COLOR,
                  borderColor: OTHERS_STROKE,
                }}
              />
            }
            label="Others"
            value={formatAmount(inChosenUnit?.others, unit)}
            share={formatShare(latest?.others, latest?.staked)}
          />
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

/** A label, an amount and its share; a button when it toggles a layer. */
function ShareRow({
  swatch,
  label,
  value,
  share,
  active = true,
  onClick,
}: {
  swatch: ReactNode
  label: ReactNode
  value: string | undefined
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
        {value !== undefined && (
          <span className="font-semibold text-label-value-13 text-primary">
            {value}
          </span>
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

function formatShare(
  part: number | null | undefined,
  total: number | null | undefined,
): string | undefined {
  const share = shareOf(part, total)
  return share !== undefined ? formatPercent(share) : undefined
}
