import { UnixTime } from '@l2beat/shared-pure'
import type { ChangeCategory } from '~/server/features/utils/changeEventConstants'
import type {
  ChangeBreakdown,
  ChangeCandidate,
} from '~/server/features/utils/changeEvents'

/** A change big enough on the chart to pin, from `start` to `end`. */
export interface ChangeEvent<M extends string = string>
  extends ChangeBreakdown {
  category: ChangeCategory
  metric: M
  start: number
  end: number
  /** The category's value at the end and the value it is compared with. */
  observed: number
  baseline: number
  /** Its height as a share of the shown series' scale around it. */
  size: number
}

/**
 * The candidates that look big next to the shown series: the change is at
 * least `minSize` of the highest value they reach around it, as a year-long
 * chart of them would draw it. That doesn't depend on the range shown, so a
 * change is pinned on every range that covers it.
 * Each candidate's levels are tried tightest first. A wider level that
 * starts earlier adds a pin for the step before the tighter rise, when that
 * step is big enough by itself. Rises that start on the same day are one.
 */
export function selectChangeEvents<M extends string>(
  candidates: ChangeCandidate<M>[],
  {
    metric,
    categories,
    minSize,
  }: {
    metric: M
    categories: readonly ChangeCategory[]
    minSize: number
  },
): ChangeEvent<M>[] {
  const byStart = new Map<string, ChangeEvent<M>>()

  for (const candidate of candidates) {
    if (
      candidate.metric !== metric ||
      !categories.includes(candidate.category)
    ) {
      continue
    }
    const scale = Math.max(...categories.map((c) => candidate.scale[c] ?? 0))
    if (scale <= 0) continue
    const height = (from: number, to: number) => Math.abs(to - from) / scale

    const found: { index: number; event: ChangeEvent<M> }[] = []
    candidate.levels.forEach((level, index) => {
      const last = found.at(-1)
      if (!last) {
        const size = height(level.baseline, candidate.observed)
        if (size < minSize) return
        found.push({
          index,
          event: {
            ...pickBreakdown(level),
            category: candidate.category,
            metric,
            start: level.onset,
            end: candidate.peak,
            observed: candidate.observed,
            baseline: level.baseline,
            size,
          },
        })
        return
      }
      const later = candidate.levels[last.index]
      const step = candidate.steps.find(
        (s) => s.from === index && s.to === last.index,
      )
      if (!later || !step || level.onset >= later.onset) return
      const size = height(level.baseline, later.baseline)
      if (size < minSize) return
      found.push({
        index,
        event: {
          ...pickBreakdown(step),
          category: candidate.category,
          metric,
          start: level.onset,
          end: Math.max(level.onset, later.onset - UnixTime.DAY),
          observed: later.baseline,
          baseline: level.baseline,
          size,
        },
      })
    })

    for (const { event } of found) {
      const key = `${event.category}:${event.start}`
      const existing = byStart.get(key)
      if (!existing || event.size > existing.size) byStart.set(key, event)
    }
  }
  return [...byStart.values()]
}

function pickBreakdown({
  contributors,
  restDelta,
  restCount,
}: ChangeBreakdown): ChangeBreakdown {
  return { contributors, restDelta, restCount }
}
