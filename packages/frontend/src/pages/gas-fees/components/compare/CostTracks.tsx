import type { GasFeesStats } from '~/server/features/gas-fees/daily/getGasFeesStats'
import { compareCosts } from '../../utils/compare'
import { formatDate, formatUsd } from '../../utils/format'
import {
  decadesOf,
  type LogScale,
  logPercent,
  logScaleOf,
} from '../../utils/logScale'
import { DecadeAxis, formatUsdDecade } from '../DecadeAxis'

const L2_COLOR = 'var(--chart-stacked-blue)'
const ETHEREUM_COLOR = 'var(--chart-ethereum)'

interface Track {
  title: string
  when: string
  l2Label: string
  l2: number
  ethereum: number
}

/** What an L2 user pays against an Ethereum user, on one shared log scale */
export function CostTracks({ stats }: { stats: GasFeesStats }) {
  const tracks: Track[] = []
  if (stats.latestErc20) {
    tracks.push({
      title: 'ERC-20 transfer',
      when: formatDate(stats.latestErc20.day),
      l2Label: `Median of ${stats.latestErc20.l2Count} L2s`,
      l2: stats.latestErc20.l2Median,
      ethereum: stats.latestErc20.ethereum,
    })
  }
  if (stats.avgFee) {
    tracks.push({
      title: 'Average transaction',
      when: 'past year',
      l2Label: 'L2s',
      l2: stats.avgFee.l2s,
      ethereum: stats.avgFee.ethereum,
    })
  }
  // A cost of zero has no place on a log scale
  const shown = tracks.filter((t) => t.l2 > 0 && t.ethereum > 0)
  if (shown.length === 0) return null
  const scale = logScaleOf(shown.flatMap((t) => [t.l2, t.ethereum]))

  return (
    <div className="flex flex-col gap-5">
      {shown.map((track) => (
        <CostTrack key={track.title} track={track} scale={scale} />
      ))}
      <div className="border-divider border-t pt-2 text-2xs text-secondary">
        <span>USD, log scale</span>
        <DecadeAxis scale={scale} format={formatUsdDecade} className="mt-1" />
      </div>
    </div>
  )
}

function CostTrack({ track, scale }: { track: Track; scale: LogScale }) {
  const comparison = compareCosts(track.l2, track.ethereum)
  const [low, high] = [track.l2, track.ethereum].sort((a, b) => a - b) as [
    number,
    number,
  ]
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-base">{track.title}</div>
          <div className="text-2xs text-secondary">{track.when}</div>
        </div>
        {comparison && (
          <span className="text-secondary text-xs">
            <span className="font-bold text-brand-deep text-xl">
              {comparison.ratio}
            </span>{' '}
            {comparison.cheaper ? 'less' : 'more'} on L2s
          </span>
        )}
      </div>
      <div className="relative h-16">
        {decadesOf(scale).map((decade) => (
          <div
            key={decade}
            className="absolute inset-y-0 border-divider border-l border-dashed"
            style={{ left: logPercent(scale, decade) }}
          />
        ))}
        <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-0.5 bg-divider" />
        <div
          className="-translate-y-1/2 absolute top-1/2 h-1.5 bg-linear-to-r from-chart-stacked-blue/40 to-chart-ethereum"
          style={{
            left: logPercent(scale, low),
            right: `calc(100% - ${logPercent(scale, high)})`,
          }}
        />
        <Marker
          value={track.l2}
          label={track.l2Label}
          color={L2_COLOR}
          scale={scale}
        />
        <Marker
          value={track.ethereum}
          label="Ethereum"
          color={ETHEREUM_COLOR}
          scale={scale}
        />
      </div>
    </div>
  )
}

function Marker({
  value,
  label,
  color,
  scale,
}: {
  value: number
  label: string
  color: string
  scale: LogScale
}) {
  return (
    <div
      className="-translate-x-1/2 absolute inset-y-0 flex flex-col items-center justify-between"
      style={{ left: logPercent(scale, value) }}
    >
      <span className="font-bold text-sm tabular-nums">{formatUsd(value)}</span>
      <span
        className="size-3 rounded-full border-2 border-surface-primary"
        style={{ backgroundColor: color }}
      />
      <span className="whitespace-nowrap text-2xs text-secondary">{label}</span>
    </div>
  )
}
