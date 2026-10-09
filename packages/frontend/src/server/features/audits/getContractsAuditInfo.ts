import type { ProjectAuditCoverage, ProjectScalingStack } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { contractAnchorId } from '~/components/audits/contractAnchor'
import { buildProjectCoverage } from './coverage/projectCoverage'
import type { AuditsUnitEntry } from './types'

export interface ContractAuditInfo {
  /** Row of this contract on the project's audit page. */
  href: string
  lines: { total: number; covered: number; uncovered: number }
  /**
   * The deployed code is identical to an audited revision whose report
   * recorded major findings, so the fix is not present in the deployment.
   */
  majorFinding?: {
    reportUrl: string
    reportTitle: string
    auditor: string
    findingIds: string[]
  }
}

/**
 * Audit coverage of a project's deployed contracts keyed by
 * `<chain>:<address>` in lower case. Empty for projects without audit data
 * and for contracts without verified source.
 */
export function getContractsAuditInfo(
  coverage: ProjectAuditCoverage | undefined,
  slug: string,
  stacks?: ProjectScalingStack[],
): Map<string, ContractAuditInfo> {
  const result = new Map<string, ContractAuditInfo>()
  if (!coverage) return result
  const model = buildProjectCoverage(
    coverage,
    ProjectId(coverage.project),
    stacks,
  )

  for (const contract of model.contracts) {
    if (contract.noSource || contract.coverage.lines.total === 0) continue
    const key = contractKey(contract.chain, contract.shortAddress)
    if (result.has(key)) continue
    result.set(key, {
      href: `/audits/projects/${slug}#${contractAnchorId(contract.chain, contract.shortAddress)}`,
      lines: contract.coverage.lines,
      majorFinding: toMajorFinding(contract.sources.flatMap((s) => s.units)),
    })
  }
  return result
}

export function contractKey(chain: string, address: string): string {
  return `${chain}:${address}`.toLowerCase()
}

function toMajorFinding(
  units: AuditsUnitEntry[],
): ContractAuditInfo['majorFinding'] | undefined {
  const flagged = units.filter(
    (u) =>
      (u.status === 'identical' || u.status === 'library') &&
      u.match !== undefined &&
      u.match.findingIds.length > 0,
  )
  const first = flagged[0]?.match
  if (!first) return undefined
  // The report holding the first unit's findings, so the ids can be found in it.
  const report = first.findings[0]?.report ?? first.report
  const findingIds = new Set<string>()
  for (const unit of flagged) {
    for (const id of unit.match?.findingIds ?? []) findingIds.add(id)
  }
  return {
    reportUrl: report.url,
    reportTitle: report.title,
    auditor: report.auditor,
    findingIds: [...findingIds],
  }
}
