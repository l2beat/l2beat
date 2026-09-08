// Raw shapes of the audit-dataset files. Only the fields the engine reads are
// declared; the dataset schema is documented in AUDIT_EXTRACT_SKILL.md there.

export interface DeployedJson {
  project: string
  discoveryTimestamp: number
  contractSelection: 'critical' | 'all'
  contracts: DeployedContract[]
}

export interface DeployedContract {
  name: string
  address: string
  chain: string
  chainSpecificAddress: string
  sourceFiles: string[]
  template?: string
}

export interface AuditSummaryJson {
  schema_version: string
  project: string
  reports: AuditReport[]
}

export interface AuditReport {
  id: string
  report_file: string
  title: string
  description: string
  isRelevant: boolean
  auditor: string
  report_date: string | null
  scopes: AuditScope[]
}

export interface AuditScope {
  repository: string
  paths: Record<string, AuditPathEntry>
}

export interface AuditPathEntry {
  path_kind: 'file' | 'directory_recursive'
  /** Earlier to later. */
  versions: AuditVersion[]
}

export interface AuditVersion {
  revision: {
    kind: string
    commit?: string | null
    timestamp?: string | null
    url?: string
  }
  status: string
  review_phase: string
  coverage: string
  major_findings: number
}

export interface ManifestJson {
  sources: ManifestSource[]
}

export interface ManifestSource {
  repository: string
  repository_url: string
  source_path: string
  path_kind: 'file' | 'directory_recursive'
  commit: string
  files: { file: string }[]
}
