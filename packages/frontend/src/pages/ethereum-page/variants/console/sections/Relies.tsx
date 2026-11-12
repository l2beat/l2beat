import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import { UNKNOWN_POSTER_ID } from '../../../live/simulatedHead'
import { colorOf } from '../deck/BlockTape'
import { posterShares } from '../derive'
import { fmtNumber, fmtPercent, fmtUsd } from '../format'
import { ExistingSections } from '../ui/ExistingSections'
import { Instrument, Panel, Readout, SectionHead } from '../ui/Panel'
import { Ticker } from '../ui/Ticker'

const SHOWN_POSTERS = 10

/** The systems that build on Ethereum: who is posting data at this moment, and how much value rests on it */
export function Relies({
  entry,
  posters,
  posterColors,
}: {
  entry: EthereumProjectPageEntry
  posters: Map<string, BlobPoster>
  posterColors: Map<string, string>
}) {
  const flows = flowsSection(entry.sections)
  return (
    <section id="interop-flows" className="scroll-mt-20">
      <SectionHead
        title="Who relies on it"
        lede="The rollups and other systems that post their data to Ethereum and settle on it, live by block, with the value they secure."
      />
      <Instrument className="md:grid-cols-12">
        <Posters
          posters={posters}
          posterColors={posterColors}
          className="md:col-span-7"
        />
        <Secured entry={entry} className="md:col-span-5" />
      </Instrument>
      {flows && <ExistingSections items={[flows]} />}
    </section>
  )
}

/** The existing flows section, moved off `interop-flows` so this whole section can own the old anchor */
function flowsSection(
  sections: ProjectDetailsSection[],
): ProjectDetailsSection | undefined {
  const section = sections.find((s) => s.type === 'InteropFlowsSection')
  if (section?.type !== 'InteropFlowsSection') return undefined
  return {
    ...section,
    props: {
      ...section.props,
      id: 'interop-volume',
      title: 'Volume and flows',
    },
  }
}

function Posters({
  posters,
  posterColors,
  className,
}: {
  posters: Map<string, BlobPoster>
  posterColors: Map<string, string>
  className?: string
}) {
  const head = useEthereumHead()
  const shares = posterShares(head.blocks)
  const shown = shares
    .filter((s) => s.posterId !== UNKNOWN_POSTER_ID)
    .slice(0, SHOWN_POSTERS)
  const rest = shares.length - shown.length
  const max = Math.max(...shown.map((s) => s.share), 0.01)
  return (
    <Panel
      title="Posting blobs now"
      cadence="blk"
      className={className}
      accessory={
        <span className="font-mono text-[10.5px] text-secondary tabular-nums">
          {head.blocks.length > 0
            ? `${shares.filter((s) => s.posterId !== UNKNOWN_POSTER_ID).length} systems · last ${head.blocks.length} blocks`
            : 'last 64 blocks'}
        </span>
      }
    >
      <ol className="divide-y divide-divider/35">
        {shown.length === 0 &&
          Array.from({ length: SHOWN_POSTERS }, (_, i) => (
            <li key={i} className="flex h-8 items-center gap-3 px-3">
              <span className="h-2 w-24 rounded-sm bg-surface-secondary" />
              <span className="h-2 flex-1 rounded-sm bg-surface-secondary/60" />
            </li>
          ))}
        {shown.map((s, i) => {
          const poster = posters.get(s.posterId)
          const name = poster?.name ?? s.posterId
          return (
            <li
              key={s.posterId}
              className="grid h-8 grid-cols-[20px_minmax(0,9rem)_minmax(0,1fr)_44px_44px] items-center gap-x-2 px-3 text-[12px]"
            >
              <span className="font-mono text-[10.5px] text-secondary">
                {i + 1}
              </span>
              <span className="flex min-w-0 items-center gap-1.5">
                {poster?.iconUrl ? (
                  <img
                    src={poster.iconUrl}
                    alt=""
                    width={14}
                    height={14}
                    className="size-3.5 shrink-0 rounded-full"
                  />
                ) : (
                  <span className="size-3.5 shrink-0 rounded-full bg-surface-tertiary" />
                )}
                {poster?.href ? (
                  <a
                    href={poster.href}
                    className="truncate text-primary hover:underline"
                  >
                    {name}
                  </a>
                ) : (
                  <span className="truncate text-primary">{name}</span>
                )}
              </span>
              <span className="relative h-2 overflow-hidden rounded-[2px] bg-surface-secondary/60">
                <span
                  className="absolute inset-y-0 left-0 rounded-[2px] transition-[width] duration-500"
                  style={{
                    width: `${(s.share / max) * 100}%`,
                    background: colorOf(s.posterId, posterColors),
                  }}
                />
              </span>
              <span className="text-right font-mono text-secondary tabular-nums">
                <Ticker
                  value={s.blobs}
                  format={(v) => fmtNumber(Math.round(v))}
                />
              </span>
              <span className="text-right font-mono text-primary tabular-nums">
                {fmtPercent(s.share)}
              </span>
            </li>
          )
        })}
      </ol>
      {rest > 0 && (
        <div className="border-divider/60 border-t px-3 py-1.5 text-[11px] text-secondary">
          {rest} more, including unattributed blobs. Full breakdown on{' '}
          <a
            href="/blobs"
            className="text-link underline-offset-2 hover:underline"
          >
            live blobs
          </a>
          .
        </div>
      )}
    </Panel>
  )
}

function Secured({
  entry,
  className,
}: {
  entry: EthereumProjectPageEntry
  className?: string
}) {
  const head = useEthereumHead()
  const { tvs, economicSecurity, usedIn } = entry.header
  return (
    <Panel
      title="What rests on it"
      className={className}
      bodyClassName="flex flex-col"
    >
      <div className="grid grid-cols-2 gap-px border-divider/60 border-b bg-divider/50">
        <Readout
          label="Value secured"
          cadence="day"
          footer="L2s and L3s on Ethereum"
        >
          <span className="font-medium font-mono text-[22px] text-primary tabular-nums">
            {fmtUsd(tvs)}
          </span>
        </Readout>
        <Readout
          label="Economic security"
          cadence="day"
          footer="slashable stake"
        >
          <span className="font-medium font-mono text-[22px] text-primary tabular-nums">
            {economicSecurity === undefined ? '—' : fmtUsd(economicSecurity)}
          </span>
        </Readout>
        <Readout label="Systems using it" cadence="static">
          <span className="font-medium font-mono text-[22px] text-primary tabular-nums">
            {usedIn.length}
          </span>
        </Readout>
        <Readout label="Active validators" cadence="epoch">
          <span className="font-medium text-[22px] text-primary">
            <Ticker
              value={head.activeValidators}
              format={(v) => fmtNumber(Math.round(v))}
            />
          </span>
        </Readout>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 py-3">
        {usedIn.map((p) => (
          <a
            key={p.id}
            href={p.url}
            title={p.name}
            className="rounded-full ring-surface-primary transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <img
              src={p.icon}
              alt={p.name}
              width={22}
              height={22}
              className="size-[22px] rounded-full"
            />
          </a>
        ))}
      </div>
    </Panel>
  )
}
