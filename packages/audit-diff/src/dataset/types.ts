// Raw shapes of the audit-dataset files. Only the fields the engine reads are
// declared; the dataset schema is documented in AUDIT_EXTRACT_SKILL.md there.

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
  repositories: { id: string; url: string }[]
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
  /** Identifiers of the open Major/Critical findings; present iff major_findings > 0. */
  finding_ids?: string[]
}

export interface ManifestJson {
  schema_version?: string
  sources: ManifestSource[]
}

export interface ManifestSource {
  repository: string
  repository_url: string
  source_path: string
  path_kind: 'file' | 'directory_recursive'
  commit: string
  files: ManifestFile[]
}

export interface ManifestFile {
  file: string
  /** sha256 of the file as stored (post-format), see index_sources.py. */
  sha256?: string
  /** Top-level Solidity declarations, or the basename for other files. */
  units?: string[]
}

/** Root `repositories.json`. */
export interface RegistryJson {
  schema_version: string
  repositories: Record<string, RegistryEntry>
}

export interface RegistryEntry {
  url: string
  fork_of?: string
  manual?: boolean
}
