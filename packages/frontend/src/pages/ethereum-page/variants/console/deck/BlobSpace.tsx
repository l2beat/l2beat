import { type PointerEvent, useRef, useState } from 'react'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { UNKNOWN_POSTER_ID } from '../../../live/simulatedHead'
import type { BlockLimits, HeadBlock } from '../../../live/types'
import { posterShares } from '../derive'
import { fmtNumber, fmtPercent } from '../format'
import { Panel } from '../ui/Panel'
import { colorOf } from './BlockTape'

const W = 640
const H = 100
const LEGEND = 4

/** Who filled each of the last 64 blocks' blob space, stacked by poster against target and max */
export function BlobSpace({
  blocks,
  limits,
  posters,
  posterColors,
  className,
}: {
  blocks: HeadBlock[]
  limits: BlockLimits
  posters: Map<string, BlobPoster>
  posterColors: Map<string, string>
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number>()
  const shares = posterShares(blocks)
  const named = shares.filter((s) => s.posterId !== UNKNOWN_POSTER_ID)
  const top = named.slice(0, LEGEND)
  const otherShare = named.slice(LEGEND).reduce((sum, s) => sum + s.share, 0)
  const unknown = shares.find((s) => s.posterId === UNKNOWN_POSTER_ID)
  const n = Math.max(blocks.length, 64)
  const slotW = W / n
  const y = (count: number) => H - (count / limits.maxBlobs) * (H - 4)
  const hovered = hover === undefined ? undefined : blocks[hover]

  function onMove(event: PointerEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const i = Math.floor(((event.clientX - rect.left) / rect.width) * n)
    setHover(i >= 0 && i < blocks.length ? i : undefined)
  }

  return (
    <Panel
      title="Blob space by poster"
      cadence="blk"
      className={className}
      accessory={
        <a
          href="/blobs"
          className="font-mono text-[10.5px] text-secondary underline decoration-divider underline-offset-2 hover:text-primary"
        >
          Live blobs
        </a>
      }
      bodyClassName="flex flex-col px-3 pt-2 pb-2.5"
    >
      <div className="flex h-4 items-center font-mono text-[10.5px] text-secondary tabular-nums">
        {hovered ? (
          <span className="truncate">
            slot {fmtNumber(hovered.slot)} ·{' '}
            {hovered.blobs.length === 0
              ? 'no blobs'
              : hovered.blobs
                  .map(
                    (p) =>
                      `${posters.get(p.posterId)?.name ?? 'Unattributed'} ${p.blobs}`,
                  )
                  .join(', ')}
          </span>
        ) : (
          <span>
            {fmtNumber(shares.reduce((sum, s) => sum + s.blobs, 0))} blobs in{' '}
            {blocks.length} blocks
          </span>
        )}
      </div>
      <div
        ref={ref}
        className="relative mt-1 h-[80px] min-h-[80px] flex-1"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(undefined)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          role="img"
          aria-label={`Blobs per block by poster, last ${blocks.length} blocks`}
        >
          {blocks.map((block, i) => {
            let filled = 0
            return (
              <g
                key={block.slot}
                opacity={hover === undefined || hover === i ? 1 : 0.55}
              >
                {block.blobs.map((p) => {
                  const y1 = y(filled)
                  filled += p.blobs
                  const y0 = y(filled)
                  return (
                    <rect
                      key={p.posterId}
                      x={i * slotW + slotW * 0.12}
                      width={slotW * 0.76}
                      y={y0}
                      // a hairline of surface between segments, so neighbours with close colours stay apart
                      height={Math.max(0.5, y1 - y0 - 0.8)}
                      fill={colorOf(p.posterId, posterColors)}
                    />
                  )
                })}
              </g>
            )
          })}
          <line
            x1={0}
            x2={W}
            y1={y(limits.targetBlobs)}
            y2={y(limits.targetBlobs)}
            stroke="var(--primary)"
            strokeOpacity={0.55}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={0}
            x2={W}
            y1={y(limits.maxBlobs)}
            y2={y(limits.maxBlobs)}
            stroke="var(--chart-grid)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          className="-translate-y-full pointer-events-none absolute right-0 rounded-[2px] bg-surface-primary/85 px-0.5 font-mono text-[9.5px] text-secondary leading-3"
          style={{ top: `${(y(limits.targetBlobs) / H) * 100}%` }}
        >
          target {limits.targetBlobs}
        </span>
        <span
          className="-translate-y-full pointer-events-none absolute right-0 rounded-[2px] bg-surface-primary/85 px-0.5 font-mono text-[9.5px] text-secondary leading-3"
          style={{ top: `${(y(limits.maxBlobs) / H) * 100}%` }}
        >
          max {limits.maxBlobs}
        </span>
      </div>
      <ul className="mt-2 grid grid-cols-2 content-start gap-x-3 gap-y-1 text-[11px] sm:grid-cols-3">
        {top.map((s) => {
          const poster = posters.get(s.posterId)
          return (
            <li key={s.posterId} className="flex min-w-0 items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: colorOf(s.posterId, posterColors) }}
              />
              {poster?.iconUrl && (
                <img
                  src={poster.iconUrl}
                  alt=""
                  width={12}
                  height={12}
                  className="size-3 shrink-0 rounded-full"
                />
              )}
              <span className="truncate text-primary">
                {poster?.name ?? s.posterId}
              </span>
              <span className="ml-auto font-mono text-secondary tabular-nums">
                {fmtPercent(s.share)}
              </span>
            </li>
          )
        })}
        {otherShare > 0 && (
          <LegendRest
            label="Others"
            share={otherShare}
            swatch="var(--surface-tertiary)"
          />
        )}
        {unknown && (
          <LegendRest
            label="Unattributed"
            share={unknown.share}
            swatch="var(--secondary)"
          />
        )}
      </ul>
    </Panel>
  )
}

function LegendRest({
  label,
  share,
  swatch,
}: {
  label: string
  share: number
  swatch: string
}) {
  return (
    <li className="flex min-w-0 items-center gap-1.5">
      <span
        className="size-2 shrink-0 rounded-[2px]"
        style={{ background: swatch }}
      />
      <span className="truncate text-secondary">{label}</span>
      <span className="ml-auto font-mono text-secondary tabular-nums">
        {fmtPercent(share)}
      </span>
    </li>
  )
}
