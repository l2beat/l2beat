import { getDiscoveryPaths } from '@l2beat/discovery'
import type { ProjectId } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { type ProjectAuditCoverage, ProjectAuditCoverageSchema } from '../types'

export function loadAuditCoverage(
  projectId: ProjectId,
): ProjectAuditCoverage | undefined {
  const auditCoveragePath = join(
    getDiscoveryPaths().discovery,
    projectId,
    'audit-coverage.json',
  )
  if (!existsSync(auditCoveragePath)) {
    return undefined
  }
  return ProjectAuditCoverageSchema.parse(
    JSON.parse(readFileSync(auditCoveragePath, 'utf8')),
  )
}
