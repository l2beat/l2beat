import type { ProjectAuditCoverage } from '@l2beat/config'

export type AuditCoverage = ProjectAuditCoverage
export type CoverageReport = AuditCoverage['reports'][string]
export type AuditedFile = AuditCoverage['auditedFiles'][string]
export type Unit = AuditCoverage['units'][string]
