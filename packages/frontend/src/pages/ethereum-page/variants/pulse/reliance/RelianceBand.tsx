import { useRef } from 'react'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import {
  RollingNumber,
  useReorder,
} from '~/pages/blobs/components/live-blobs/liveMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { UNKNOWN_POSTER_ID } from '../../../live/simulatedHead'
import type { HeadBlock } from '../../../live/types'
import { ExistingSections } from '../ExistingSections'
import { formatCompact, formatInteger, formatPercent } from '../format'
import { Band, BigNumber, Stat } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'

const SHOWN_POSTERS = 8

interface Share {
  id: string
  name: string
  color: string | undefined
  iconUrl: string | undefined
  href: string | undefined
  blobs: number
}

const formatCount = (v: number) => formatInteger(v)

/** The systems that lean on Ethereum, and what they keep on it */
export function RelianceBand({
  entry,
  blocks,
  posters,
  interopSection,
}: {
  entry: EthereumProjectPageEntry
  blocks: HeadBlock[]
  posters: Map<string, BlobPoster>
  interopSection: ProjectDetailsSection | undefined
}) {
  const shares = toShares(blocks, posters)
  const total = shares.reduce((sum, s) => sum + s.blobs, 0)
  const activePosters = shares.filter((s) => s.id !== UNKNOWN_POSTER_ID).length
  const { usedIn, tvs } = entry.header

  return (
    <>
      <Band
        id={interopSection ? 'who-relies' : 'interop-flows'}
        title="Who relies on it"
        lead={
          <>
            {usedIn.length} rollups and other systems keep their data on
            Ethereum and settle here, so their users can check them and leave if
            they misbehave. What they secure is only as safe as Ethereum.
          </>
        }
        deeperLabel={`All ${usedIn.length} systems using Ethereum for data`}
        deeper={<UsedInGrid usedIn={usedIn} />}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-8">
          <Stat
            label={
              <Explain explainer="Total value secured by the systems that post their data to Ethereum: assets bridged in, bridged externally or minted on them.">
                Value they secure
              </Explain>
            }
            cadence={<CadenceTag cadence="daily" />}
            className="col-span-2 md:col-span-1"
          >
            <BigNumber value={`$${formatCompact(tvs)}`} />
          </Stat>
          <Stat
            label="Systems using it for data"
            cadence={<CadenceTag cadence="daily" />}
          >
            <BigNumber value={formatInteger(usedIn.length)} />
          </Stat>
          <Stat
            label={
              <Explain explainer="Distinct systems with at least one blob in the last 64 blocks, about 13 minutes.">
                Posting right now
              </Explain>
            }
            cadence={<CadenceTag cadence="every block" />}
          >
            <BigNumber
              value={
                <RollingNumber value={activePosters} format={formatCount} />
              }
            />
          </Stat>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-bold text-heading-18">
              Who filled the last 64 blocks
            </h3>
            <span className="text-label-value-14 text-secondary tabular-nums">
              {formatInteger(total)} blobs
            </span>
          </div>
          <PosterShares shares={shares} total={total} />
        </div>
      </Band>
      {interopSection && <ExistingSections items={[interopSection]} />}
    </>
  )
}

function PosterShares({ shares, total }: { shares: Share[]; total: number }) {
  const ref = useRef<HTMLOListElement>(null)
  const top = shares
    .filter((s) => s.id !== UNKNOWN_POSTER_ID)
    .slice(0, SHOWN_POSTERS)
  const rest = shares.filter(
    (s) => s.id !== UNKNOWN_POSTER_ID && !top.includes(s),
  )
  const unknown = shares.find((s) => s.id === UNKNOWN_POSTER_ID)
  const max = Math.max(1, ...shares.map((s) => s.blobs))
  useReorder(ref, top.map((s) => s.id).join())

  return (
    <ol ref={ref} className="mt-5 space-y-2.5">
      {top.map((share) => (
        <ShareRow key={share.id} share={share} total={total} max={max} />
      ))}
      {rest.length > 0 && (
        <ShareRow
          share={{
            id: 'others',
            name: `${rest.length} others`,
            color: undefined,
            iconUrl: undefined,
            href: undefined,
            blobs: rest.reduce((sum, s) => sum + s.blobs, 0),
          }}
          total={total}
          max={max}
        />
      )}
      {unknown && (
        <ShareRow
          share={{ ...unknown, name: 'Not attributed yet' }}
          total={total}
          max={max}
        />
      )}
    </ol>
  )
}

function ShareRow({
  share,
  total,
  max,
}: {
  share: Share
  total: number
  max: number
}) {
  const name = share.href ? (
    <a href={share.href} className="truncate hover:underline">
      {share.name}
    </a>
  ) : (
    <span className="truncate text-secondary">{share.name}</span>
  )
  return (
    <li
      data-flip-key={share.id}
      className="grid grid-cols-[minmax(0,8.5rem)_1fr_3.5rem] items-center gap-3 md:grid-cols-[11rem_1fr_4.5rem]"
    >
      <span className="flex min-w-0 items-center gap-2 font-medium text-label-value-15">
        {share.iconUrl ? (
          <img
            src={share.iconUrl}
            alt=""
            className="size-5 shrink-0 rounded-full"
          />
        ) : (
          <span className="size-5 shrink-0 rounded-full bg-surface-tertiary" />
        )}
        {name}
      </span>
      <span className="h-3 overflow-hidden rounded-full bg-surface-secondary/60">
        <span
          className="block h-full origin-left rounded-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `scaleX(${share.blobs / max})`,
            backgroundColor: share.color ?? 'var(--surface-tertiary)',
          }}
        />
      </span>
      <span className="text-right text-label-value-14 tabular-nums">
        {formatPercent(total === 0 ? 0 : share.blobs / total, 1)}
      </span>
    </li>
  )
}

function UsedInGrid({
  usedIn,
}: {
  usedIn: EthereumProjectPageEntry['header']['usedIn']
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
      {usedIn.map((project) => (
        <li key={project.id} className="min-w-0">
          <a
            href={project.url}
            className="flex min-w-0 items-center gap-2 text-label-value-14 hover:underline"
          >
            <img
              src={project.icon}
              alt=""
              className="size-5 shrink-0 rounded-full"
              loading="lazy"
            />
            <span className="truncate">{project.name}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function toShares(
  blocks: HeadBlock[],
  posters: Map<string, BlobPoster>,
): Share[] {
  const byId = new Map<string, number>()
  for (const block of blocks) {
    for (const part of block.blobs) {
      byId.set(part.posterId, (byId.get(part.posterId) ?? 0) + part.blobs)
    }
  }
  return [...byId.entries()]
    .map(([id, blobs]) => {
      const poster = posters.get(id)
      return {
        id,
        name: poster?.name ?? id,
        color: poster?.color,
        iconUrl: poster?.iconUrl,
        href: poster?.href,
        blobs,
      }
    })
    .sort((a, b) => b.blobs - a.blobs || a.name.localeCompare(b.name))
}
