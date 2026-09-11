// Types shared by the server (web/server) and the client (web/client). Most of them come from src/.

import type {
  AskConfig,
  AskEvent,
  AskRecord,
  AskRequest,
  Claim,
} from '../../src/agent'
import type { RunMeta, RunProgress, UnitSummary } from '../../src/pipeline'
import type {
  Column,
  Program,
  ProgramClause,
  ProgramDecl,
  ProgramItem,
  ProgramSection,
} from '../../src/program'
import type { Home } from '../../src/proof'
import type { QueryResult } from '../../src/query'
import type { RelationRecord, Stage } from '../../src/rules'
import type { ProofNode } from '../../src/souffle'

export type {
  AskConfig,
  AskEvent,
  AskRecord,
  AskRequest,
  Claim,
  Column,
  Home,
  Program,
  ProgramClause,
  ProgramDecl,
  ProgramItem,
  ProgramSection,
  ProofNode,
  QueryResult,
  RelationRecord,
  RunMeta,
  RunProgress,
  Stage,
  UnitSummary,
}

export interface ProjectChoice {
  id: string
  /** synthetic: the spike's projects/ folder; config: packages/config/src/projects */
  where: 'synthetic' | 'config'
  name: string
  contracts: number
  eoas: number
  units: number
  timestamp?: number
}

export interface FixtureChoice {
  id: string
  label: string
  lines: number
  bytes: number
}

export interface Inputs {
  projects: ProjectChoice[]
  fixtures: FixtureChoice[]
}

export type RunRequest =
  | { kind: 'project'; id: string }
  | { kind: 'fixture'; id: string }
  | { kind: 'paste'; name: string; source: string }

export type RunEvent =
  | RunProgress
  | { type: 'done'; run: RunInfo }
  | { type: 'error'; message: string }

export interface RunListItem {
  id: string
  name: string
  kind: 'project' | 'file'
  createdAt: string
  units: number
  ok: number
  asks: number
}

/** run.json plus what the screens need at once: counts per relation and the library. */
export interface RunInfo {
  meta: RunMeta
  /** Rows per relation: project-stage relations and exported unit relations from the union, unit-internal ones summed over units. */
  counts: Record<string, number>
  library: LibraryInfo
}

export interface LibraryInfo {
  files: Array<{ name: string; text: string }>
  unit: Program
  project: Program
  relations: RelationRecord[]
  exported: string[]
}

export interface StorageEntry {
  contract: string
  label: string
  slot: string
  offset: number
  type: string
  astId: number
}

export interface UnitInfo {
  summary: UnitSummary & { resolvedFrom?: string; syntheticIds?: number }
  source: string
  factCounts: Record<string, number>
  derivedCounts: Record<string, number>
  storage: StorageEntry[]
  /** Top-level shape of solc's output, for the "what solc returned" panel. */
  solc: {
    astNodes: number
    contracts: string[]
    bytes: number
    warnings: number
  }
}

export interface RowsPage {
  relation: string
  columns: Column[]
  total: number
  offset: number
  rows: string[][]
}

export interface ExplainRequest {
  id: string
  atom: string
  /** Include the queries of this ask when locating the atom. */
  ask?: string
  depth?: number
}

export interface ExplainResult {
  atom: string
  home: Home
  proof: ProofNode
  ms: number
}

export interface AskDetail {
  record: AskRecord
  briefing: string
  events: AskEvent[]
  queries: Array<QueryResult & { text: string }>
}

export interface PromoteRequest {
  id: string
  ask: string
  query: string
  /** The relation of the query to add to the library, with its description. */
  relation: string
  description: string
}
