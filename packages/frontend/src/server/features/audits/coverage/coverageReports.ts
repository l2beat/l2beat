import type { ProjectAuditCoverage, ProjectScalingStack } from '@l2beat/config'
import type { AuditReportOrigin } from '../types'
import type { CoverageUnit } from './coverageModel'

// Reports of a project's audit coverage: where they come from relative to the
// project and how they are linked. No repository lineage is involved: a
// report is a stack audit when its collection is the stack's collection, and
// it only reaches a project by matching its deployed code.

/**
 * The dataset collection holding the audits of a scaling stack. Only stacks
 * with a collection in the dataset are listed; a mapped collection is used
 * only when the coverage knows it.
 */
const STACK_COLLECTIONS: Partial<Record<ProjectScalingStack, string>> = {
  'OP Stack': 'optimism',
  Arbitrum: 'arbitrum',
  'ZK Stack': 'zksync2',
  'Agglayer CDK': 'agglayer',
  'SN Stack': 'starknet',
  Taiko: 'taiko',
}

export function stackCollectionOf(
  stacks: ProjectScalingStack[] | undefined,
  coverage: ProjectAuditCoverage,
): string | undefined {
  for (const stack of stacks ?? []) {
    const collection = STACK_COLLECTIONS[stack]
    if (collection && coverage.collections[collection]) return collection
  }
  return undefined
}

export const ORIGIN_RANK: Record<AuditReportOrigin, number> = {
  own: 0,
  stack: 1,
  library: 2,
  other: 3,
}

export function reportOrigin(
  reportId: string,
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
): AuditReportOrigin {
  const collections = coverage.reports[reportId]?.collections ?? []
  if (collections.includes(projectId)) return 'own'
  if (stackCollection !== undefined && collections.includes(stackCollection)) {
    return 'stack'
  }
  if (
    collections.length > 0 &&
    collections.every((id) => coverage.collections[id]?.kind === 'library')
  ) {
    return 'library'
  }
  return 'other'
}

/** The report's first collection, which holds the linked document. */
export function reportCollection(
  reportId: string,
  coverage: ProjectAuditCoverage,
): string {
  return coverage.reports[reportId]?.collections[0] ?? ''
}

/** The report document in the dataset repository at the dataset commit. */
export function reportUrl(
  coverage: ProjectAuditCoverage,
  reportId: string,
): string {
  const document = coverage.reports[reportId]?.document ?? ''
  const { repository, commit } = coverage.dataset
  const path = document.split('/').map(encodeURIComponent).join('/')
  return `https://github.com/${repository}/blob/${commit}/${path}`
}

/**
 * The audited file in its upstream repository. Repository ids follow the
 * dataset's rule: `owner/repo` is on GitHub, `gist/<owner>/<id>` is a gist,
 * an id whose first segment contains a dot is `<host>/<path>`.
 */
export function auditedFileUrl(
  file: ProjectAuditCoverage['auditedFiles'][string],
): string {
  const { repository, commit, path } = file
  const [first, ...rest] = repository.split('/')
  if (first === 'gist') {
    return `https://gist.github.com/${rest.join('/')}`
  }
  if (first?.includes('.')) {
    return `https://${repository}/blob/${commit}/${path}`
  }
  return `https://github.com/${repository}/blob/${commit}/${path}`
}

/** Reports referenced by the units of the given flat sources. */
export function matchedReportIds(
  coverage: ProjectAuditCoverage,
  flats: string[],
): Set<string> {
  const ids = new Set<string>()
  for (const flat of flats) {
    for (const [unitId] of coverage.flats[flat] ?? []) {
      for (const report of coverage.units[unitId]?.reports ?? []) {
        ids.add(report)
      }
    }
  }
  return ids
}

/** The closest origin among a unit's reports. */
export function unitOrigin(
  unit: CoverageUnit,
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
): AuditReportOrigin {
  let best: AuditReportOrigin = 'other'
  for (const id of unit.reports ?? []) {
    const origin = reportOrigin(id, coverage, projectId, stackCollection)
    if (ORIGIN_RANK[origin] < ORIGIN_RANK[best]) best = origin
  }
  return best
}

/**
 * The report shown for a matched unit: the one with the closest origin, the
 * newest on ties, then by id for determinism.
 */
export function primaryReportId(
  unit: CoverageUnit,
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
): string | undefined {
  return sortReportIds(
    unit.reports ?? [],
    coverage,
    projectId,
    stackCollection,
  )[0]
}

/** Report ids by origin, then newest first, then id. */
export function sortReportIds(
  ids: string[],
  coverage: ProjectAuditCoverage,
  projectId: string,
  stackCollection: string | undefined,
): string[] {
  return [...ids].sort((a, b) => {
    const rank =
      ORIGIN_RANK[reportOrigin(a, coverage, projectId, stackCollection)] -
      ORIGIN_RANK[reportOrigin(b, coverage, projectId, stackCollection)]
    if (rank !== 0) return rank
    const dateA = coverage.reports[a]?.date ?? ''
    const dateB = coverage.reports[b]?.date ?? ''
    if (dateA !== dateB) return dateA < dateB ? 1 : -1
    return a.localeCompare(b)
  })
}
