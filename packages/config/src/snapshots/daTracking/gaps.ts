import groupBy from 'lodash/groupBy'
import type { BaseProject } from '../../types'
import { AI_GUARD_RAIL, formatRange } from '../compare'
import type { Range } from '../types'
import { createLabel, forEachDaTrackingConfig, getRange } from './identities'

export interface TrackedRange extends Range {
  daLayer: string
  label: string
}

export interface CoverageGap {
  daLayer: string
  /** First uncovered point, in the layer's native unit. */
  from: number
  /** Last uncovered point. */
  to: number
  before: TrackedRange
  after: TrackedRange
}

/**
 * Holes a project's DA tracking leaves on a single DA layer.
 *
 * Ranges are inclusive on both ends and compared in the layer's native unit
 * (blocks, or unix seconds for eigen-da) - a layer never mixes the two.
 *
 * - overlaps are fine (e.g. a delta sequencer tracked next to the main one),
 *   so only the covered frontier matters, not the pairwise order
 * - `next.since <= prev.until + 1` is a handover, not a hole; the existing
 *   convention is `next.since === prev.until` (projects/ink/ink.ts)
 * - a trailing closed entry is fine - the project simply left the layer
 */
export function findCoverageGaps(entries: TrackedRange[]): CoverageGap[] {
  const gaps: CoverageGap[] = []
  for (const [daLayer, layerEntries] of Object.entries(
    groupBy(entries, (e) => e.daLayer),
  )) {
    const sorted = [...layerEntries].sort((a, b) => a.since - b.since)
    let frontier = sorted[0].since - 1
    let last = sorted[0]
    for (const entry of sorted) {
      if (frontier === Number.POSITIVE_INFINITY) {
        break
      }
      if (entry.since > frontier + 1) {
        gaps.push({
          daLayer,
          from: frontier + 1,
          to: entry.since - 1,
          before: last,
          after: entry,
        })
      }
      const until = entry.until ?? Number.POSITIVE_INFINITY
      if (until > frontier) {
        frontier = until
        last = entry
      }
    }
  }
  return gaps
}

/**
 * Holes that predate this check and were accepted as real, e.g. a project
 * that genuinely stopped posting and resumed later. They are NOT closed by
 * editing since/until - that moves a range and makes the backend trim or
 * re-sync it - but by adding a new entry for the missing range, which is a
 * deliberate, data-affecting decision.
 *
 * Key format: `${projectId}/${daLayer}/${from}-${to}`, comment why.
 */
export const LEGACY_COVERAGE_GAPS: string[] = []

export function gapKey(projectId: string, gap: CoverageGap): string {
  return `${projectId}/${gap.daLayer}/${gap.from}-${gap.to}`
}

/** Coverage gaps across all projects, minus the accepted legacy ones. */
export function findDaTrackingGaps(
  projects: BaseProject[],
  legacyGaps: string[] = LEGACY_COVERAGE_GAPS,
): { projectId: string; gap: CoverageGap }[] {
  const flat: (TrackedRange & { projectId: string })[] = []
  forEachDaTrackingConfig(projects, (projectId, config) => {
    flat.push({
      projectId,
      daLayer: config.daLayer,
      label: createLabel(config),
      ...getRange(config),
    })
  })

  const legacy = new Set(legacyGaps)
  return Object.entries(groupBy(flat, (e) => e.projectId)).flatMap(
    ([projectId, entries]) =>
      findCoverageGaps(entries)
        .filter((gap) => !legacy.has(gapKey(projectId, gap)))
        .map((gap) => ({ projectId, gap })),
  )
}

export function gapMessage(
  gaps: { projectId: string; gap: CoverageGap }[],
): string {
  return [
    'da-tracking stops covering a project and picks it up again later:',
    ...gaps.map(
      ({ projectId, gap }) =>
        `- ${projectId} on ${gap.daLayer} is not tracked between ${gap.from} and ${gap.to} [${gapKey(projectId, gap)}]\n` +
        `    ends:    ${gap.before.label} [${formatRange(gap.before)}]\n` +
        `    resumes: ${gap.after.label} [${formatRange(gap.after)}]`,
    ),
    "Close each hole with a config entry covering the missing range - a new entry if the hole has its own identity (inbox/sequencers/...), otherwise by extending the neighbouring entry; the latter is a range change and the 'ranges changed' check will tell you what it costs. If the hole is real and accepted (the project genuinely posted nothing), add its key to LEGACY_COVERAGE_GAPS in packages/config/src/snapshots/daTracking/gaps.ts with a comment saying why.",
    AI_GUARD_RAIL,
  ].join('\n')
}
