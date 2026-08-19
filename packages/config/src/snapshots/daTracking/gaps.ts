import type { BaseProject } from '../../types'
import { formatRange } from '../ranges'
import type { ConfigViolation } from '../types'
import {
  createLabel,
  forEachDaTrackingConfig,
  getConfigRange,
} from './identities'

export interface TrackedRange {
  daLayer: string
  label: string
  since: number
  /** Absent means the range is still open, i.e. it covers everything after. */
  until?: number
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
 * Gaps a project's DA tracking leaves on a single DA layer.
 *
 * Ranges are inclusive on both ends and compared in the layer's native unit
 * (blocks, or unix seconds for eigen-da) - a layer never mixes the two.
 *
 * Rules:
 * - overlaps are allowed on purpose (e.g. a delta sequencer tracked next to
 *   the main one), so only the covered frontier matters, not pairwise order
 * - `next.since <= prev.until + 1` is adjacency, not a gap: closing an entry
 *   at the last block it was live and starting the next one at the following
 *   block is the intended way to hand over
 * - a trailing closed entry is fine - the project simply left the layer
 */
export function findCoverageGaps(entries: TrackedRange[]): CoverageGap[] {
  const gaps: CoverageGap[] = []
  for (const [daLayer, layerEntries] of groupByLayer(entries)) {
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

function groupByLayer(entries: TrackedRange[]): Map<string, TrackedRange[]> {
  const byLayer = new Map<string, TrackedRange[]>()
  for (const entry of entries) {
    byLayer.set(entry.daLayer, [...(byLayer.get(entry.daLayer) ?? []), entry])
  }
  return byLayer
}

/**
 * Gaps that predate this check. They are not fixed by editing ranges - moving
 * a since/until makes the backend re-sync and wipe the affected configuration.
 * Closing one means backfilling the missing range with a new config entry,
 * which is a deliberate, data-affecting decision.
 *
 * Format: `${projectId}/${daLayer}/${from}-${to}`.
 */
export const LEGACY_COVERAGE_GAPS: string[] = []

/** Coverage gaps across all projects, minus the accepted legacy ones. */
export function findDaTrackingGaps(projects: BaseProject[]): ConfigViolation[] {
  const byProject = new Map<string, TrackedRange[]>()
  forEachDaTrackingConfig(projects, (projectId, config) => {
    byProject.set(projectId, [
      ...(byProject.get(projectId) ?? []),
      {
        daLayer: config.daLayer,
        label: createLabel(config),
        ...getConfigRange(config),
      },
    ])
  })

  const legacy = new Set(LEGACY_COVERAGE_GAPS)
  const violations: ConfigViolation[] = []
  for (const [projectId, entries] of byProject) {
    for (const gap of findCoverageGaps(entries)) {
      if (legacy.has(gapKey(projectId, gap))) {
        continue
      }
      violations.push({
        projectId,
        message:
          `${projectId} is not tracked on ${gap.daLayer} between ${gap.from} and ${gap.to} [${gapKey(projectId, gap)}]:\n` +
          `- ends: ${describe(gap.before)}\n` +
          `- resumes: ${describe(gap.after)}`,
      })
    }
  }
  return violations
}

export function gapKey(projectId: string, gap: CoverageGap): string {
  return `${projectId}/${gap.daLayer}/${gap.from}-${gap.to}`
}

function describe(entry: TrackedRange): string {
  return `${entry.label} [${formatRange(entry)}]`
}
