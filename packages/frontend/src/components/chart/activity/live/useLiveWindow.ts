import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import {
  DEFAULT_LIVE_RANGE,
  getLiveBucketSeconds,
  LIVE_RANGES,
  type LiveRange,
} from '~/utils/range/liveRanges'
import { clampTo, getMoveEnd } from './liveView'
import { LOOKAHEAD_DRAWINGS, useLivePlayhead } from './useLivePlayhead'

/**
 * The live view's window: the range picked, where it ends, the data read for
 * it and where that is on screen. Following the newest block it scrolls with
 * the clock, while the charts are hovered it holds still on the data it was
 * drawn from, and while it is moved on the overview it stays as read until
 * the move stops
 */
export function useLiveWindow({
  projectId,
  onGlide,
}: {
  projectId: string
  /** Seconds the window has moved past what is drawn, each frame */
  onGlide: (seconds: number) => void
}) {
  const trpc = useTRPC()
  const [range, setRange] = useState<LiveRange>(DEFAULT_LIVE_RANGE)
  /** Where the window ends, undefined while following the newest block */
  const [to, setTo] = useState<number>()
  /** Where the overview's window is moved to, before that is read */
  const [seekTo, setSeekTo] = useState<number>()
  const [hovered, setHovered] = useState(false)
  const still = usePrefersReducedMotion()

  const refetchInterval = (to === undefined ? 5 : 30) * 1000
  const query = useQuery({
    ...trpc.activity.liveWindow.queryOptions({ projectId, range, to }),
    placeholderData: keepPreviousData,
    refetchInterval,
    // what was read ahead of opening the view may be older
    staleTime: refetchInterval,
  })
  const { isLoading, isPlaceholderData, isError } = query
  // tooltips read where buckets are drawn. Only once this window's data is
  // read, as the pointer can come in before, and for this window alone, as
  // the range or end can change from the keyboard with the pointer still in
  const [{ data, dataUpdatedAt }, holding] = useHeld(
    { data: query.data, dataUpdatedAt: query.dataUpdatedAt },
    hovered && !isPlaceholderData && query.data !== undefined,
    `${range}:${to}`,
  )

  // a new range's placeholder is drawn as the range it was read for, rather
  // than squeezed into the new one, until the new range's data comes
  const shown = data?.window.range ?? range
  // drawn every 1/300 of the window, about 2.5 pixels, and slid in between
  const redrawEvery = LIVE_RANGES[shown].seconds / 300
  const playhead = useLivePlayhead({
    dataEnd: to === undefined ? data?.window.to : undefined,
    earliestEnd: data && data.window.readFrom + LIVE_RANGES[shown].seconds,
    readAtMs: dataUpdatedAt,
    redrawEvery,
    onGlide,
    held: holding,
    still,
  })
  const domain: [number, number] | undefined = data
    ? playhead !== undefined
      ? [playhead - LIVE_RANGES[shown].seconds, playhead]
      : [data.window.from, data.window.to]
    : undefined

  const { seconds } = LIVE_RANGES[range]
  const buffer = data?.buffer
  const seeking = seekTo !== undefined && buffer !== undefined
  // where the window is asked to end, undefined at the newest block: a move
  // on the overview as it will be read
  const end = seeking ? clampTo(seekTo, buffer, seconds) : to
  const selection: [number, number] | undefined = seeking
    ? [(end ?? buffer.to) - seconds, end ?? buffer.to]
    : // as asked for while that is read, not as it was
      to !== undefined && isPlaceholderData
      ? [to - seconds, to]
      : domain

  return {
    data,
    isLoading,
    isPlaceholderData,
    isError,
    range,
    /** The range the data is for */
    shown,
    domain,
    /** Whether the window scrolls with the clock */
    scrolling: playhead !== undefined,
    /** Seconds drawn past the domain, for what slides in before the next drawing */
    lookahead: playhead === undefined ? 0 : LOOKAHEAD_DRAWINGS * redrawEvery,
    /** Whether the window ends at the newest block and stays there */
    following: to === undefined,
    /** Whether the charts show something else than was asked for */
    stale: isPlaceholderData || seekTo !== undefined,
    /** The window on the overview: as asked for, before the charts have it */
    selection,
    /** The same, as a screen reader says it */
    selectionText:
      end === undefined || !selection
        ? 'Live'
        : formatRange(selection[0], selection[1], { seconds: true }),
    /** Whether the overview's window is off the newest block, or being moved off it */
    lookingBack: end !== undefined,
    setHovered,
    setRange: (next: LiveRange) => {
      setRange(next)
      setTo(clampTo(to, buffer, LIVE_RANGES[next].seconds))
    },
    follow: () => setTo(undefined),
    seek: setSeekTo,
    moveTo: (end: number) => {
      // the range's own bucket until it is read: a move rounded to another
      // range's would be read again once rounded to this one's
      const bucket =
        data?.window.range === range
          ? data.window.bucket
          : getLiveBucketSeconds(range)
      setTo(getMoveEnd(end, buffer, seconds, bucket))
    },
  }
}

/**
 * `value` as it was when `hold` began for `key`, for as long as that lasts,
 * and whether it is held
 */
function useHeld<T>(value: T, hold: boolean, key: string): [T, boolean] {
  const [held, setHeld] = useState<{ value: T; key: string }>()
  const next = hold ? (held?.key === key ? held : { value, key }) : undefined
  if (next !== held) setHeld(next)
  return [next ? next.value : value, next !== undefined]
}
