import { LiveIndicator } from '~/components/LiveIndicator'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import type { EthereumHead } from '../../../live/types'
import { formatUsd } from '../format'
import { OrbitMap } from '../map/OrbitMap'
import type { Poster, WindowStats } from '../model'
import { Hud } from './Hud'
import { ReorgNotice } from './ReorgNotice'
import { RiskVerdict } from './RiskVerdict'

export function OrbitHero({
  entry,
  live,
  stats,
  posters,
}: {
  entry: EthereumProjectPageEntry
  live: EthereumHead
  stats: WindowStats
  posters: Map<string, Poster>
}) {
  return (
    <section
      id="pulse"
      aria-labelledby="orbit-title"
      className="bg-surface-primary px-4 pt-6 pb-5 md:rounded-xl md:px-6 md:pt-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
        <div className="min-w-0 max-w-[640px]">
          <div className="flex items-center gap-3">
            <img
              src={entry.icon}
              alt=""
              width={36}
              height={36}
              className="size-8 md:size-9"
            />
            <h1 id="orbit-title" className="text-heading-32 md:text-heading-40">
              Ethereum
            </h1>
          </div>
          <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
            The base layer the systems we assess rely on.{' '}
            <LiveSentence stats={stats} ready={live.head !== undefined} /> The
            rollups among them secure{' '}
            <span className="font-medium text-primary">
              {formatUsd(entry.header.tvs)}
            </span>
            .
          </p>
        </div>
        <LiveStatus live={live} />
      </header>

      <div className="mt-2 md:mt-0">
        <OrbitMap live={live} rows={stats.rows} posters={posters}>
          <Hud live={live} stats={stats} />
        </OrbitMap>
      </div>

      <MapLegend
        shown={stats.rows.filter((r) => r.tier !== undefined).length}
        total={stats.rows.length}
      />
      <ReorgNotice reorg={live.lastReorg} />
      <RiskVerdict entry={entry} />
    </section>
  )
}

function LiveSentence({
  stats,
  ready,
}: {
  stats: WindowStats
  ready: boolean
}) {
  if (!ready) return <span>Waiting for the first block.</span>
  return (
    <span>
      In the last {stats.slots} slots,{' '}
      <span className="font-medium text-primary tabular-nums">
        {stats.systems} systems
      </span>{' '}
      posted their data to it.
    </span>
  )
}

function LiveStatus({ live }: { live: EthereumHead }) {
  const label =
    live.status === 'live'
      ? 'Live at the head'
      : live.status === 'connecting'
        ? 'Connecting to the chain'
        : 'Reconnecting'
  return (
    <div className="flex flex-col items-start gap-1 md:items-end">
      <span className="flex items-center gap-2 font-medium text-label-value-14">
        <LiveIndicator disabled={live.status !== 'live'} />
        {label}
      </span>
      <span className="text-label-value-12 text-secondary">
        Head values, before finality
      </span>
    </div>
  )
}

function MapLegend({ shown, total }: { shown: number; total: number }) {
  return (
    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-label-value-12 text-secondary leading-snug lg:mt-1 lg:justify-center">
      <span>
        Closer and bigger: more of the blobs in the last 64 slots
        {total > shown && `, ${shown} of ${total} shown`}
      </span>
      <span>Rings, inside out: time to next slot, gas, blobs by system</span>
      <span className="max-md:hidden">Hover a system for its share</span>
    </p>
  )
}
