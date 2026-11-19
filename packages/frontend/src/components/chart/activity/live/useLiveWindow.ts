import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  LIVE_RANGES,
  type LiveRange,
} from '~/server/features/layer2s/activity/live/liveRanges'
import { useTRPC } from '~/trpc/React'
import { LOOKAHEAD_DRAWINGS, useLivePlayhead } from './useLivePlayhead'

/**
 * The window read for the range, and where it is on screen: following the
 * newest block it scrolls with the clock, and while the charts are hovered
 * it holds still on the data it was drawn from
 */
export function useLiveWindow({
  projectId,
  range,
  to,
  hovered,
  onGlide,
}: {
  projectId: string
  range: LiveRange
  /** Where the window ends, undefined while following the newest block */
  to: number | undefined
  hovered: boolean
  /** Seconds the window has moved past what is drawn, each frame */
  onGlide: (seconds: number) => void
}) {
  const trpc = useTRPC()
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
  const { seconds } = LIVE_RANGES[shown]
  // drawn every 1/300 of the window, about 2.5 pixels, and slid in between
  const redrawEvery = seconds / 300
  const playhead = useLivePlayhead({
    dataEnd:
      to === undefined && data?.buffer !== undefined
        ? data.window.to
        : undefined,
    readAtMs: dataUpdatedAt,
    redrawEvery,
    onGlide,
    held: holding,
  })
  const domain: [number, number] | undefined = data
    ? playhead !== undefined
      ? [playhead - seconds, playhead]
      : [data.window.from, data.window.to]
    : undefined

  return {
    data,
    isLoading,
    isPlaceholderData,
    isError,
    /** The range the data is for */
    shown,
    domain,
    /** Whether the window scrolls with the clock */
    scrolling: playhead !== undefined,
    /** Seconds drawn past the domain, for what slides in before the next drawing */
    lookahead: playhead === undefined ? 0 : LOOKAHEAD_DRAWINGS * redrawEvery,
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
