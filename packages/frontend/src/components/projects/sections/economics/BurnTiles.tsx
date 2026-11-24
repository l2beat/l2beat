import { cn } from '~/utils/cn'
import { COLORS } from './chart'
import type { WindowSummary } from './economics'
import { formatEth, formatEthShort, formatSignedEth } from './format'
import { Figure, Swatch, Tile, TileTitle, TYPE } from './ui'

const RING = 88
const STROKE = 10

/**
 * The window's issuance as a full ring and its burn as an arc over it, so
 * the share of the issuance the burn offset reads as the arc's length. A
 * burn larger than the issuance laps onto an inner ring.
 */
export function OffsetTile({
  summary,
  rangeLabel,
}: {
  summary: WindowSummary
  rangeLabel: string
}) {
  const share = summary.burnOffset
  const r = (RING - STROKE) / 2
  const inner = r - STROKE + 1
  const circumference = 2 * Math.PI * r
  const firstLap = Math.min(1, share)
  const secondLap = Math.min(1, Math.max(0, share - 1))

  return (
    <Tile area="offset" label="Burn offset">
      <TileTitle meta={rangeLabel}>Burn offset</TileTitle>
      <div className="flex items-center justify-between gap-4">
        <Figure
          value={`${(share * 100).toFixed(1)}%`}
          sub="of issuance burned"
        />
        <svg
          width={RING}
          height={RING}
          viewBox={`0 0 ${RING} ${RING}`}
          role="img"
          aria-label={`Burn offset ${(share * 100).toFixed(1)}% of issuance`}
          className="-rotate-90 shrink-0"
        >
          <circle
            cx={RING / 2}
            cy={RING / 2}
            r={r}
            fill="none"
            stroke={COLORS.issuance}
            strokeOpacity={0.25}
            strokeWidth={STROKE}
          />
          <circle
            cx={RING / 2}
            cy={RING / 2}
            r={r}
            fill="none"
            stroke={COLORS.burn}
            strokeWidth={STROKE}
            strokeLinecap={firstLap < 1 ? 'round' : 'butt'}
            strokeDasharray={`${Math.max(firstLap * circumference, 0.5)} ${circumference}`}
          />
          {secondLap > 0 && (
            <circle
              cx={RING / 2}
              cy={RING / 2}
              r={inner}
              fill="none"
              stroke={COLORS.burn}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={`${secondLap * 2 * Math.PI * inner} ${2 * Math.PI * inner}`}
            />
          )}
        </svg>
      </div>
      <dl className="mt-auto flex flex-col gap-2.5">
        <Line
          label="Issued"
          value={signedShort(summary.issued)}
          swatch={<Swatch color={COLORS.issuance} className="opacity-50" />}
        />
        <Line
          label="Burned"
          value={signedShort(-summary.burned)}
          swatch={<Swatch color={COLORS.burn} />}
        />
        <div className="border-divider border-t pt-2.5">
          <Line label="Net" value={signedShort(summary.net)} strong />
        </div>
      </dl>
    </Tile>
  )
}

function signedShort(value: number): string {
  if (Math.abs(value) < 1e6) return formatSignedEth(value)
  return `${value > 0 ? '+' : ''}${formatEthShort(value)}`
}

function Line({
  label,
  value,
  swatch,
  strong,
}: {
  label: string
  value: string
  swatch?: React.ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt
        className={cn(
          'flex items-center gap-1.5 font-medium text-label-value-14',
          strong ? 'text-primary' : 'text-secondary',
        )}
      >
        {swatch}
        {label}
      </dt>
      <dd
        className={cn(
          TYPE.value,
          'whitespace-nowrap',
          strong && 'font-semibold',
        )}
      >
        {value} <span className="text-secondary">ETH</span>
      </dd>
    </div>
  )
}

/** The window's average burn per day, with per hour and minute under it. */
export function BurnRateTile({
  summary,
  rangeLabel,
}: {
  summary: WindowSummary
  rangeLabel: string
}) {
  const perDay = summary.days > 0 ? summary.burned / summary.days : 0
  return (
    <Tile area="rate" label="Burn rate">
      <TileTitle meta={`average, ${rangeLabel}`}>Burn rate</TileTitle>
      <Figure
        value={formatEth(perDay)}
        unit="ETH / day"
        sub={`${formatEth(perDay / 24)} ETH / hour · ${formatEth(perDay / 1440)} ETH / min`}
      />
    </Tile>
  )
}
