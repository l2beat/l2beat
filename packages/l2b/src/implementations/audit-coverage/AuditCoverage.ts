import type { DeclarationKind } from './splitSource'

export interface AuditCoverage {
  schema_version: '1.0.0'
  project: string
  datasetCommit: string
  discoveredAt: number
  generatedAt: number
  reports: Record<string, CoverageReport>
  auditedFiles: Record<string, AuditedFile>
  units: Record<string, Unit>
  flats: Record<string, [string, number][]>
  contracts: Record<string, string>
}

export interface CoverageReport {
  collections: string[]
  title: string
  auditor: string
  date: string | null
}

export interface AuditedFile {
  repository: string
  commit: string
  path: string
}

export interface Unit {
  name: string
  kind: DeclarationKind
  lines: number
  status: 'identical' | 'differs' | 'none'
  audited?: { object: string; lines: [number, number]; name?: string }
  reports?: string[]
  added?: [number, number][]
  removed?: [number, number, number][]
}
