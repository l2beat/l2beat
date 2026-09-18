import type { UnitRef } from '@l2beat/audit-diff'
import { contractAnchorId } from '~/components/audits/contractAnchor'
import { auditCoverageSource } from './AuditCoverageSource'

export interface ContractAuditInfo {
  /** Row of this contract on the project's audit page. */
  href: string
  lines: { total: number; covered: number; uncovered: number }
  /**
   * The deployed code is identical to an audited revision whose report
   * recorded major findings, so the fix is not present in the deployment.
   */
  majorFinding?: {
    reportUrl?: string
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
  slug: string,
): Map<string, ContractAuditInfo> {
  const result = new Map<string, ContractAuditInfo>()
  const report = auditCoverageSource.getProject(slug)
  if (!report) return result

  for (const contract of report.contracts) {
    if (contract.zk || !contract.address || contract.noSource) continue
    if (contract.summary.lines.total === 0) continue
    const key = contractKey(contract.chain, contract.address)
    if (result.has(key)) continue

    const units = contract.files.flatMap((f) => f.units)
    result.set(key, {
      href: `/audits/projects/${slug}#${contractAnchorId(contract.chain, contract.address)}`,
      lines: contract.summary.lines,
      majorFinding: toMajorFinding(units),
    })
  }
  return result
}

export function contractKey(chain: string, address: string): string {
  return `${chain}:${address}`.toLowerCase()
}

function toMajorFinding(
  units: UnitRef[],
): ContractAuditInfo['majorFinding'] | undefined {
  const flagged = units.filter(
    (u) =>
      (u.status === 'identical' || u.status === 'library') &&
      u.match &&
      u.match.majorFindings > 0,
  )
  const first = flagged[0]?.match
  if (!first) return undefined
  const report = auditCoverageSource.getReport(first.reportId)
  const findingIds = new Set<string>()
  for (const unit of flagged) {
    for (const id of unit.match?.findingIds ?? []) findingIds.add(id)
  }
  return {
    reportUrl: report?.url,
    reportTitle: report?.title ?? first.reportId,
    auditor: report?.auditor ?? '',
    findingIds: [...findingIds],
  }
}
