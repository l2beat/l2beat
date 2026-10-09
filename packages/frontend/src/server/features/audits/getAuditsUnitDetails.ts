import { v } from '@l2beat/validate'
import { fetchAuditedBlob } from './coverage/auditedBlobs'
import { auditedFileUrl } from './coverage/coverageReports'
import { getDeployedFlat } from './coverage/deployedFlatSources'
import { renderUnitDiff, toHunks } from './coverage/renderUnitDiff'
import { getAuditsProject } from './getAuditsProjects'
import type { AuditsUnitDetails } from './types'

export const AuditsUnitDetailsParams = v.object({
  slug: v.string(),
  /** sha256 of the deployed flat source. */
  flat: v.string(),
  unitId: v.string(),
})
export type AuditsUnitDetailsParams = v.infer<typeof AuditsUnitDetailsParams>

/**
 * Source and diff of one deployed unit, loaded lazily by the project page.
 * The deployed source comes from the project's flat sources in the database,
 * the audited one from the dataset repository on GitHub.
 */
export async function getAuditsUnitDetails(
  params: AuditsUnitDetailsParams,
): Promise<AuditsUnitDetails | undefined> {
  const project = await getAuditsProject(params.slug)
  if (!project) return undefined
  const coverage = project.auditCoverage
  const placed = coverage.flats[params.flat]?.find(
    ([id]) => id === params.unitId,
  )
  const unit = coverage.units[params.unitId]
  if (!placed || !unit) return undefined
  const startLine = placed[1]

  const flat = await getDeployedFlat(project.id, params.flat)
  if (flat === undefined) return { startLine, source: '', stale: true }
  const deployedLines = flat
    .split('\n')
    .slice(startLine - 1, startLine - 1 + unit.lines)
  const details: AuditsUnitDetails = {
    startLine,
    source: deployedLines.join('\n'),
  }
  if (!unit.audited) return details

  const file = coverage.auditedFiles[unit.audited.object]
  if (!file) return details
  const [auditedStart, auditedEnd] = unit.audited.lines
  details.audited = { url: auditedFileUrl(file), startLine: auditedStart }
  if (unit.status !== 'differs') return details

  const blob = await fetchAuditedBlob(coverage.dataset.repository, file.blob)
  const auditedLines = blob.split('\n').slice(auditedStart - 1, auditedEnd)
  const lines = renderUnitDiff(
    deployedLines,
    auditedLines,
    unit.added ?? [],
    unit.removed ?? [],
    startLine,
    auditedStart,
  )
  details.diff = {
    added: lines.filter((l) => l.type === '+').length,
    removed: lines.filter((l) => l.type === '-').length,
    hunks: toHunks(lines),
  }
  return details
}
