import { UnixTime } from '@l2beat/shared-pure'
import { manifest } from '~/utils/Manifest'
import type { ChangeCategory } from './changeEventConstants'

/**
 * Pieces shared by the chart pins that mark notable changes (activity, TVS):
 * the event shape, how a day's change splits across projects, and how
 * consecutive notable days merge into one episode.
 */

export interface ChangeProject {
  name: string
  slug: string
  iconUrl: string
}

/** [projectId, observed - baseline, hasShortHistory] */
export type ChangeContributor = [string, number, boolean]

export interface ChangeEvent<M extends string = string> {
  timestamp: number
  category: ChangeCategory
  metric: M
  /** The category's value that day and the value it is compared with. */
  observed: number
  baseline: number
  score: number
  contributors: ChangeContributor[]
  restDelta: number
  restCount: number
  /** The strongest day of its episode; only peaks get a pin. */
  isPeak: boolean
}

export interface ChangeEventsData<M extends string = string> {
  projects: Record<string, ChangeProject>
  events: ChangeEvent<M>[]
}

/** Below this many days of history, a robust z is noise. */
export const MIN_HISTORY_DAYS = 21
const MAX_CONTRIBUTORS = 3
// Flat histories give huge z-scores; cap it so ranking follows size.
const MAX_RANKING_Z = 50
// A calm day or two inside a surge shouldn't split it into two events.
const MAX_EPISODE_GAP = 3 * UnixTime.DAY

/** A category's day: its total, what it is compared with, and who moved. */
export interface CategoryDay {
  observed: number
  baseline: number
  deltas: ChangeContributor[]
}

export function createChangeEvent<M extends string>(
  timestamp: number,
  category: ChangeCategory,
  metric: M,
  day: CategoryDay,
  robustZ: number,
): ChangeEvent<M> {
  const change = day.observed - day.baseline
  const deltas = [...day.deltas].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const rest = deltas.slice(MAX_CONTRIBUTORS)
  return {
    timestamp,
    category,
    metric,
    observed: day.observed,
    baseline: day.baseline,
    score: Math.abs(change) * Math.min(Math.abs(robustZ), MAX_RANKING_Z),
    contributors: deltas
      .slice(0, MAX_CONTRIBUTORS)
      .filter(([, delta]) => delta !== 0),
    restDelta: rest.reduce((sum, [, delta]) => sum + delta, 0),
    restCount: rest.filter(([, delta]) => delta !== 0).length,
    isPeak: false,
  }
}

/**
 * Notable days in the same direction, at most a few days apart, are one
 * episode: its day with the largest change is the peak. The other days stay,
 * so a multi-day surge is explained on every day it covers.
 */
export function markEpisodePeaks<M extends string>(
  candidates: ChangeEvent<M>[],
): ChangeEvent<M>[] {
  const events = [...candidates].sort((a, b) => a.timestamp - b.timestamp)
  const episodeByKey = new Map<
    string,
    { lastTimestamp: number; peak: ChangeEvent<M> }
  >()

  for (const event of events) {
    const change = event.observed - event.baseline
    const key = `${event.metric}:${event.category}:${Math.sign(change)}`
    const episode = episodeByKey.get(key)

    if (episode && event.timestamp - episode.lastTimestamp <= MAX_EPISODE_GAP) {
      episode.lastTimestamp = event.timestamp
      const { peak } = episode
      if (Math.abs(change) > Math.abs(peak.observed - peak.baseline)) {
        peak.isPeak = false
        event.isPeak = true
        episode.peak = event
      }
    } else {
      event.isPeak = true
      episodeByKey.set(key, { lastTimestamp: event.timestamp, peak: event })
    }
  }
  return events
}

export function getRobustZ(
  value: number,
  history: number[],
): number | undefined {
  if (history.length < MIN_HISTORY_DAYS) return undefined
  const center = median(history)
  const mad = median(history.map((h) => Math.abs(h - center)))
  // Flat histories have MAD = 0; fall back to a 1% band so z stays finite.
  const scale = Math.max(1.4826 * mad, 0.01 * Math.abs(center), 1)
  return (value - center) / scale
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0)
}

/** Names and icons of the projects the events list. */
export function getChangeProjects(
  projects: { id: string; name: string; slug: string }[],
  events: ChangeEvent[],
): Record<string, ChangeProject> {
  const used = new Set(
    events.flatMap((e) => e.contributors.map(([projectId]) => projectId)),
  )
  const result: Record<string, ChangeProject> = {}
  for (const project of projects) {
    if (!used.has(project.id)) continue
    result[project.id] = {
      name: project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }
  }
  return result
}
