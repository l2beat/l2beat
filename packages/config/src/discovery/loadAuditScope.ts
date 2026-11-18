import { getDiscoveryPaths } from '@l2beat/discovery'
import type { ProjectId } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { type ProjectAuditScope, ProjectAuditScopeSchema } from '../types'

export function loadAuditScope(
  projectId: ProjectId,
): ProjectAuditScope | undefined {
  const auditScopePath = join(
    getDiscoveryPaths().discovery,
    projectId,
    'audit-scope.json',
  )
  if (!existsSync(auditScopePath)) {
    return undefined
  }
  return ProjectAuditScopeSchema.parse(
    JSON.parse(readFileSync(auditScopePath, 'utf8')),
  )
}
