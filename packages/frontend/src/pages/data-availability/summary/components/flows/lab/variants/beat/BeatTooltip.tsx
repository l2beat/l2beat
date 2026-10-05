import { formatNumberWithCommas } from '@l2beat/shared-pure'
import { useLayoutEffect, useRef, useState } from 'react'
import { formatBlobs } from '../../../daFlowsUnit'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import type { LabData, LabPoster } from '../../model'
import { describeMembers, getSlotNumber } from './format'
import { getBatchAt, type Sequence } from './sequence'
import type { Hover } from './useSequencerHover'

// LabTooltip's gap from the pointer and its padding, both sides
const POINTER_GAP = 14
const PADDING = 24

/**
 * A note tells its batch: who sent it, how many blobs, into which slot. A row
 * tells who it is; the row of everyone else names a few of the projects in
 * it. Over the lower rows the tooltip opens above the pointer, so it stays
 * on the card rather than covering the legend and running off it.
 */
export function BeatTooltip({
  hover,
  containerWidth,
  containerHeight,
  data,
  sequence,
  spotlight,
}: {
  hover: Hover
  containerWidth: number
  containerHeight: number
  data: LabData
  sequence: Sequence
  /** A project of everyone else that was picked, standing in for that row */
  spotlight: LabPoster | undefined
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  // measured before paint, so it never shows in the wrong place first
  useLayoutEffect(() => {
    setContentHeight(contentRef.current?.offsetHeight ?? 0)
  })
  const above = hover.y > containerHeight * 0.55
  const y = above
    ? hover.y - contentHeight - PADDING - 2 * POINTER_GAP
    : hover.y

  return (
    <LabTooltip x={hover.x} y={y} containerWidth={containerWidth}>
      <div ref={contentRef}>
        <TooltipContent
          hover={hover}
          data={data}
          sequence={sequence}
          spotlight={spotlight}
        />
      </div>
    </LabTooltip>
  )
}

function TooltipContent({
  hover: { target },
  data,
  sequence,
  spotlight,
}: {
  hover: Hover
  data: LabData
  sequence: Sequence
  spotlight: LabPoster | undefined
}) {
  const batch = getBatchAt(sequence, target)
  if (batch) {
    const poster = data.posters[batch.posterIndex]
    if (!poster) return null
    return (
      <PosterTooltipContent
        poster={poster}
        footer={
          <>
            Batch of {formatBlobs(batch.blobs)} in slot{' '}
            <span className="tabular-nums">
              {formatNumberWithCommas(getSlotNumber(data.range[0], batch.slot))}
            </span>
          </>
        }
      />
    )
  }

  const track = sequence.tracks[target.track]
  if (!track) return null
  if (!track.isEveryoneElse) {
    return <PosterTooltipContent poster={track.poster} />
  }
  if (spotlight) return <PosterTooltipContent poster={spotlight} />
  return (
    <PosterTooltipContent
      poster={track.poster}
      footer={describeMembers(track.members)}
    />
  )
}
