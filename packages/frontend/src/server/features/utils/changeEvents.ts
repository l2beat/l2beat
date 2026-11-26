import { manifest } from '~/utils/Manifest'
import type { ChangeCategory } from './changeEventConstants'

/**
 * Pieces shared by the chart pins that mark notable changes (activity, TVS).
 * The server finds candidate changes and how each splits across projects;
 * the chart decides which to pin, because that depends on which series it
 * shows (see `selectChangeEvents`).
 */

export interface ChangeProject {
  name: string
  slug: string
  iconUrl: string
}

/** [projectId, its part of the change] */
export type ChangeContributor = [string, number]

/** How a change splits across projects: the largest parts, then the rest. */
export interface ChangeBreakdown {
  contributors: ChangeContributor[]
  restDelta: number
  restCount: number
}

/**
 * One way to measure a candidate: where its rise began and the level it is
 * compared with. The breakdown is of the candidate's value against it.
 */
export interface ChangeLevel extends ChangeBreakdown {
  onset: number
  baseline: number
}

/**
 * The rise between two levels of one candidate, from the wider level's
 * baseline (`from`) up to the tighter one's (`to`), for a step that a later
 * peak sits on. The breakdown is of the tighter baseline against the wider.
 */
export interface ChangeStep extends ChangeBreakdown {
  from: number
  to: number
}

export interface ChangeCandidate<M extends string = string> {
  category: ChangeCategory
  metric: M
  /** The day the candidate is measured at, and its value then. */
  peak: number
  observed: number
  /** Tightest first. */
  levels: ChangeLevel[]
  steps: ChangeStep[]
  /** Each category's highest value around the peak; see `getLocalMax`. */
  scale: Partial<Record<ChangeCategory, number>>
}

export interface ChangeEventsData<M extends string = string> {
  projects: Record<string, ChangeProject>
  candidates: ChangeCandidate<M>[]
}

const MAX_CONTRIBUTORS = 3

export function getBreakdown(deltas: ChangeContributor[]): ChangeBreakdown {
  const sorted = deltas
    .filter(([, delta]) => delta !== 0)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const rest = sorted.slice(MAX_CONTRIBUTORS)
  return {
    contributors: sorted.slice(0, MAX_CONTRIBUTORS),
    restDelta: rest.reduce((sum, [, delta]) => sum + delta, 0),
    restCount: rest.length,
  }
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0)
}

/** The value at `p` (0–1) of the sorted values, by nearest lower rank. */
export function percentile(values: number[], p: number): number | undefined {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(p * (sorted.length - 1))]
}

/** Names and icons of the projects the candidates list. */
export function getChangeProjects(
  projects: { id: string; name: string; slug: string }[],
  candidates: ChangeCandidate[],
): Record<string, ChangeProject> {
  const used = new Set(
    candidates.flatMap((c) =>
      [...c.levels, ...c.steps].flatMap((b) =>
        b.contributors.map(([projectId]) => projectId),
      ),
    ),
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
