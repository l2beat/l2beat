import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import {
  DEFAULT_LIVE_RANGE,
  formatLiveLength,
  getLiveBucketSeconds,
  getLiveRange,
  LIVE_BUFFER_RANGE,
  LIVE_RANGES,
} from '~/utils/range/liveRanges'
import { getSeam } from './liveSteps'
import {
  clampTo,
  getLiveView,
  getMoveEnd,
  getTargetEnd,
  holdsReads,
  isRead,
  type LiveTarget,
} from './liveView'
import { useLiveChase } from './useLiveChase'
import { LOOKAHEAD_DRAWINGS, useLivePlayhead } from './useLivePlayhead'

const BUFFER_SECONDS = LIVE_RANGES[LIVE_BUFFER_RANGE]

/**
 * The live view's window: its length, where it ends, the data read for it
 * and where that is on screen. Following the newest block it scrolls with
 * the clock, and while the charts are hovered it holds still on the data it
 * was drawn from. Once the overview or the presets are reached for, the whole
 * buffer is read at the length's bucket, and the charts follow the window
 * through it as it is moved or resized. They show only what the reads have
 * without a break, in bars of one size: asked for more, they stay where they
 * are, dimmed
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
  const [seconds, setSeconds] = useState(LIVE_RANGES[DEFAULT_LIVE_RANGE])
  /** Where the window ends, undefined while following the newest block */
  const [to, setTo] = useState<number>()
  /** Where the overview's window is moved or resized to, before that is read */
  const [seekTo, setSeekTo] = useState<LiveTarget>()
  const [hovered, setHovered] = useState(false)
  const [reached, setReached] = useState(false)
  const still = usePrefersReducedMotion()
  // the clock's glide past what is drawn, which charts on their way to
  // another window, or looking back, do without
  const glided = useRef(0)
  const glides = useRef(true)
  /** What the charts showed last */
  const last = useRef<[number, number]>(undefined)

  const refetchInterval = (to === undefined ? 5 : 30) * 1000
  const query = useQuery({
    ...trpc.activity.liveWindow.queryOptions({ projectId, seconds }),
    placeholderData: keepPreviousData,
    refetchInterval,
    // what was read ahead of opening the view may be older
    staleTime: refetchInterval,
  })
  // the window's own read has what came since, so the two meet while the
  // buffer's is no older than the window is long
  const wholeRefetchInterval = Math.max(60, seconds / 2) * 1000
  // a window as long as the buffer is read whole already
  const readsWhole = reached && seconds < BUFFER_SECONDS
  const wholeQuery = useQuery({
    ...trpc.activity.liveWindow.queryOptions({
      projectId,
      seconds,
      whole: true,
    }),
    placeholderData: keepPreviousData,
    enabled: readsWhole,
    refetchInterval: wholeRefetchInterval,
    staleTime: wholeRefetchInterval,
  })
  const { isLoading, isPlaceholderData, isError } = query
  // for this window alone, as the length or end can change from the keyboard
  // with the pointer still in
  const [held, holding] = useHeld(
    {
      data: query.data,
      dataUpdatedAt: query.dataUpdatedAt,
      whole: wholeQuery.data,
    },
    holdsReads({
      hovered,
      lookingBack: to !== undefined,
      window: {
        isRead: !isPlaceholderData && query.data !== undefined,
        // a retry paused while offline is still pending
        pending: query.fetchStatus !== 'idle',
      },
      whole: { pending: wholeQuery.fetchStatus !== 'idle' },
    }),
    `${seconds}:${to}:${isPlaceholderData || (readsWhole && wholeQuery.isPlaceholderData)}`,
  )
  const { data, dataUpdatedAt } = held
  // only while it meets the window read, which may have moved on without it,
  // in bars of the same size
  const seam =
    data && held.whole ? getSeam(data.window, held.whole.window) : undefined
  const whole = seam === undefined ? undefined : held.whole

  // a new length's placeholder is drawn at the length it was read for,
  // rather than squeezed into the new one, until the new length's data comes
  const shown = data?.window.seconds ?? seconds
  // drawn every 1/300 of the window, about 2.5 pixels, and slid in between
  const redrawEvery = shown / 300
  const playhead = useLivePlayhead({
    dataEnd: to === undefined ? data?.window.to : undefined,
    earliestEnd: data && data.window.readFrom + shown,
    readAtMs: dataUpdatedAt,
    redrawEvery,
    onGlide: (seconds) => {
      glided.current = seconds
      onGlide(glides.current ? seconds : 0)
    },
    held: holding,
    still,
  })

  const buffer = data?.buffer
  const seeking = seekTo !== undefined && buffer !== undefined
  const length = seeking ? seekTo.seconds : seconds
  // where the window is asked to end, undefined at the newest block: a move
  // on the overview as it goes, then where it was put, within the buffer as
  // that moves on
  const end =
    seeking && !seekTo.holdsEnd
      ? getTargetEnd(seekTo, buffer)
      : to === undefined || !buffer
        ? to
        : Math.min(Math.max(to, buffer.from + length), buffer.to)
  // where a window following the newest block ends
  const liveEnd = playhead ?? data?.window.to
  const asked = end ?? liveEnd
  const selection: [number, number] | undefined =
    asked === undefined ? undefined : [asked - length, asked]
  // what the reads have, without a break. In this length's bars, or another
  // length's drawn until they come, which are not what the window ends on
  const read = data && {
    from: (whole ?? data).window.readFrom,
    to: data.window.to,
    bucket:
      data.window.seconds === length
        ? data.window.bucket
        : getLiveBucketSeconds(length),
  }
  const { view, covered, kept } = getLiveView({
    asked: selection,
    own: end === undefined && length === shown,
    last: last.current,
    live: liveEnd === undefined ? undefined : [liveEnd - shown, liveEnd],
    read,
  })
  const atLive = covered ? end === undefined : !kept
  const { view: domain, moving } = useLiveChase({
    target: view,
    windowKey: covered ? `${length}:${end}` : kept ? 'kept' : `${shown}:live`,
    // through what is read alone, and not while hovered, as tooltips read
    // where buckets are drawn
    animate: covered && isRead(last.current, read) && !hovered && !still,
    ahead: () => (atLive ? glided.current : 0),
  })
  // once drawn: a render begun again would otherwise start from a view that
  // never was on screen
  useLayoutEffect(() => {
    last.current = domain
  })
  glides.current = atLive && !moving
  const scrolling = playhead !== undefined && glides.current
  // or at the bars of another length, drawn until this one's are read
  const stale =
    !covered ||
    (data !== undefined &&
      getLiveBucketSeconds(data.window.seconds) !==
        getLiveBucketSeconds(seconds))
  const setEnd = (next: number | undefined, length = seconds) => {
    setTo(next)
    // read while looking back, the newest blocks may be half a minute old.
    // Another length has its own read
    if (next === undefined && to !== undefined && length === seconds) {
      void query.refetch()
    }
  }

  return {
    data,
    /** The whole buffer, once reached for, while it meets the window read at `seam` */
    whole,
    seam,
    isLoading,
    isError,
    /** The length asked for */
    seconds,
    /** Its preset, none for another length */
    range: getLiveRange(seconds),
    /** The length of the window on the overview */
    length,
    /** What the charts show: the window, or on the way to it */
    domain,
    /** Whether the charts scroll with the clock */
    scrolling,
    /** Seconds drawn past the domain, for what slides in before the next drawing */
    lookahead: scrolling ? LOOKAHEAD_DRAWINGS * redrawEvery : 0,
    /** Whether the window ends at the newest block and stays there */
    following: to === undefined,
    /** Whether the charts show something else than was asked for */
    stale,
    /** Whether the reads have the window on the overview */
    covered,
    /** The window on the overview: as asked for, before the charts have it */
    selection,
    /** The same, as a screen reader says it */
    selectionText:
      end === undefined || !selection
        ? `Live, last ${formatLiveLength(length)}`
        : formatRange(selection[0], selection[1], { seconds: true }),
    /** Whether the overview's window is off the newest block, or being moved off it */
    lookingBack: end !== undefined,
    setHovered,
    /** The overview or the presets are about to be used */
    reach: () => setReached(true),
    setLength: (next: number) => {
      setReached(true)
      setSeconds(next)
      setEnd(clampTo(to, buffer, next), next)
    },
    follow: () => setEnd(undefined),
    seek: (target: LiveTarget | undefined) => {
      if (target) setReached(true)
      setSeekTo(target)
    },
    moveTo: (target: LiveTarget) => {
      setSeconds(target.seconds)
      // rounded to another length's bucket, a held end would move
      if (target.holdsEnd) return
      // the length's own bucket until it is read: a move rounded to another
      // length's would be read again once rounded to this one's
      const bucket =
        data?.window.seconds === target.seconds
          ? data.window.bucket
          : getLiveBucketSeconds(target.seconds)
      setEnd(getMoveEnd(target, buffer, bucket), target.seconds)
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
