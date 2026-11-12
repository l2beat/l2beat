import { memo } from 'react'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { UNKNOWN_POSTER_ID } from '../../../live/simulatedHead'
import type { BlockLimits, HeadBlock } from '../../../live/types'
import { formatInteger } from '../format'

const COLUMN = 10
const GAP = 2
const HEIGHT = 72

/**
 * The last 64 blocks side by side, each blob coloured by the system that
 * posted it: the live blobs page in miniature, for a glance and a way in.
 */
export const BlobStrip = memo(function BlobStrip({
  blocks,
  limits,
  posters,
}: {
  blocks: HeadBlock[]
  limits: BlockLimits
  posters: Map<string, BlobPoster>
}) {
  const width = blocks.length * COLUMN
  const unit = HEIGHT / limits.maxBlobs
  const targetY = HEIGHT - limits.targetBlobs * unit
  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-[72px] w-full"
      role="img"
      aria-label={`Blobs in each of the last ${blocks.length} blocks, coloured by who posted them`}
    >
      {blocks.map((block, i) => {
        let y = HEIGHT
        return (
          <g key={`${block.slot}-${block.hash ?? ''}`}>
            <title>
              {block.number === undefined
                ? `Slot ${formatInteger(block.slot)}: no block`
                : `Block ${formatInteger(block.number)}: ${block.blobCount} blobs`}
            </title>
            <rect
              x={i * COLUMN}
              y={0}
              width={COLUMN - GAP}
              height={HEIGHT}
              className="fill-surface-secondary/50"
            />
            {block.blobs.map((part) => {
              const h = part.blobs * unit
              y -= h
              const color = posters.get(part.posterId)?.color
              return (
                <rect
                  key={part.posterId}
                  x={i * COLUMN}
                  y={y}
                  width={COLUMN - GAP}
                  height={Math.max(0, h - 0.6)}
                  fill={
                    part.posterId === UNKNOWN_POSTER_ID || !color
                      ? 'var(--surface-tertiary)'
                      : color
                  }
                />
              )
            })}
          </g>
        )
      })}
      <line
        x1={0}
        x2={width}
        y1={targetY}
        y2={targetY}
        className="stroke-primary/50"
        strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
})
