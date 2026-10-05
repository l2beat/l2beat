import { formatSeconds } from '@l2beat/shared-pure'
import type { FocusEvent, PointerEvent, RefObject } from 'react'
import { cn } from '~/utils/cn'
import type { LabPoster } from '../../model'
import { type SequencerLayout, TRACK_INSET } from './drawSequencer'
import type { Track } from './sequence'

interface Props {
  tracks: Track[]
  layout: SequencerLayout
  width: number
  /** Icons only, where there is no room for names */
  compact: boolean
  /** The pulse ring of each row, by track, in its own color */
  ringColors: string[]
  ringRefs: RefObject<(HTMLSpanElement | null)[]>
  highlighted: string | undefined
  /** The row under the pointer, on the canvas or here, shaded the same in both */
  hoveredTrack: number | undefined
  /** A project from everyone else that was picked. It takes over that row's label */
  spotlight: LabPoster | undefined
  onSelect: (posterId: string) => void
  onHover: (track: number, event: PointerEvent | FocusEvent) => void
  onLeave: () => void
}

/**
 * The instruments: a label at the start of every row. Each is the same band
 * as its row on the canvas, so a label and its notes read as one strip.
 */
export function Gutter({
  tracks,
  layout,
  width,
  ringRefs,
  ringColors,
  hoveredTrack,
  ...row
}: Props) {
  return (
    <div className="absolute top-0 bottom-0 left-0" style={{ width }}>
      {tracks.map((track, i) => (
        <GutterRow
          key={track.id}
          track={track}
          index={i}
          top={(layout.rowTops[i] ?? 0) + TRACK_INSET}
          height={layout.rowHeight - 2 * TRACK_INSET}
          hovered={hoveredTrack === i}
          ringColor={ringColors[i]}
          ringRef={(element) => {
            ringRefs.current[i] = element
          }}
          {...row}
        />
      ))}
    </div>
  )
}

function GutterRow({
  track,
  index,
  top,
  height,
  hovered,
  compact,
  ringColor,
  ringRef,
  highlighted,
  spotlight,
  onSelect,
  onHover,
  onLeave,
}: Pick<
  Props,
  'compact' | 'highlighted' | 'spotlight' | 'onSelect' | 'onHover' | 'onLeave'
> & {
  track: Track
  index: number
  top: number
  height: number
  hovered: boolean
  ringColor: string | undefined
  ringRef: (element: HTMLSpanElement | null) => void
}) {
  const shown = track.isEveryoneElse && spotlight ? spotlight : track.poster
  const isPicked =
    highlighted !== undefined &&
    (track.id === highlighted || shown.id === highlighted)
  const othersCount =
    track.isEveryoneElse && !spotlight ? track.members.length : undefined
  // everyone else picks nothing, unless one of them was picked: then it lets go
  const pick = track.isEveryoneElse ? spotlight?.id : track.id

  const className = cn(
    'absolute inset-x-0 flex items-center gap-2 rounded-l-md text-left transition-[opacity,background-color] duration-200',
    compact ? 'justify-center' : 'pr-2 pl-2.5',
    isPicked || hovered ? 'bg-primary/[0.07]' : 'bg-primary/[0.035]',
    highlighted !== undefined && !isPicked && 'opacity-30',
  )
  const shared = {
    style: { top, height },
    onPointerMove: (event: PointerEvent) => onHover(index, event),
    onPointerLeave: onLeave,
  }
  const label = (
    <>
      <TrackIcon
        poster={shown}
        othersCount={othersCount}
        ringColor={ringColor}
        ringRef={ringRef}
      />
      {!compact && (
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-label-value-13">
            {shown.name}
          </span>
          <span className="mt-1 block truncate text-label-value-12 text-secondary">
            {othersCount !== undefined
              ? `${othersCount} projects`
              : `every ${formatSeconds(shown.cadence.interval)}`}
          </span>
        </span>
      )}
    </>
  )

  if (!pick) {
    return (
      <div className={className} {...shared}>
        {label}
      </div>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={isPicked}
      aria-label={compact ? shown.name : undefined}
      onClick={() => onSelect(pick)}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) onHover(index, event)
      }}
      onBlur={onLeave}
      className={cn(
        className,
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
      )}
      {...shared}
    >
      {label}
    </button>
  )
}

function TrackIcon({
  poster,
  othersCount,
  ringColor,
  ringRef,
}: {
  poster: LabPoster
  /** Stands in for an icon on the row of everyone else */
  othersCount: number | undefined
  ringColor: string | undefined
  ringRef: (element: HTMLSpanElement | null) => void
}) {
  return (
    <span className="relative size-5 shrink-0">
      {othersCount !== undefined ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-surface-secondary font-bold text-[8px] text-secondary leading-none tracking-tight">
          +{othersCount}
        </span>
      ) : poster.iconUrl ? (
        <img
          src={poster.iconUrl}
          alt=""
          className="size-5 rounded-full"
          draggable={false}
        />
      ) : (
        <span className="block size-5 rounded-full bg-surface-secondary" />
      )}
      {/* scaled and faded by the player as the row's notes sound */}
      <span
        ref={ringRef}
        aria-hidden="true"
        className="-inset-px pointer-events-none absolute rounded-full border-2 opacity-0 will-change-transform"
        style={{ borderColor: ringColor }}
      />
    </span>
  )
}
