// Types shared by the explorer's server (web/server) and client (web/client).

import type { AstNode } from '../../src/ast'

export type { AstNode }

export interface ContractChoice {
  id: string
  label: string
  group: string
  lines: number
  bytes: number
}

// ---------- projects: a discovery output folder (discovered.json + .flat/) run as a whole ----------

export interface ProjectChoice {
  /** Folder name under packages/config/src/projects. */
  id: string
  name: string
  contracts: number
  eoas: number
  /** Flattened .sol files under .flat/. */
  units: number
  timestamp?: number
}

/** One flattened file of a project, before or after running. */
export interface ProjectUnitInfo {
  unit: string
  slug: string
  /** The discovered entry this code belongs to (the proxy address for proxied contracts). */
  address: string
  entryName: string
  codeAddress: string
  contractName: string
  role: 'self' | 'proxy' | 'implementation'
  bytes: number
  status?: 'ok' | 'failed'
  error?: string
  solcVersion?: string
  timings?: Timings
  baseRows?: number
  derivedRows?: number
}

export interface ProjectContractInfo {
  address: string
  name: string
  proxyType: string
  template: string
  units: ProjectUnitInfo[]
}

/** What the explorer shows before a project run: the discovered contracts and their files. */
export interface ProjectInfo {
  id: string
  name: string
  dir: string
  contracts: ProjectContractInfo[]
  eoas: number
  units: ProjectUnitInfo[]
  missing: Array<{
    entryName: string
    contractName: string
    expectedPath: string
  }>
}

export interface ProjectRunResult {
  kind: 'project'
  runId: string
  runDir: string
  project: string
  projectId: string
  contracts: ProjectContractInfo[]
  units: ProjectUnitInfo[]
  /** Discovery as facts: dEntry, dImpl, dUnit, dValue, dPermission. */
  discovery: FactRelation[]
  /** Rows per unit relation the project program imported. */
  imported: Record<string, number>
  program: Program
  derived: DerivedRelation[]
  souffle: { version: string; command: string; stderr: string }
  timings: {
    unitsMs: number
    factsMs: number
    souffleMs: number
    reportMs: number
  }
  report: string
  files: string[]
}

/** One line of the NDJSON stream `POST /api/project/run` answers with. */
export type ProjectEvent =
  | { type: 'plan'; units: number; missing: number }
  | { type: 'unit'; unit: string; index: number; status: 'running' }
  | {
      type: 'unit'
      unit: string
      index: number
      status: 'done'
      ms: number
      solcVersion: string
    }
  | {
      type: 'unit'
      unit: string
      index: number
      status: 'failed'
      error: string
    }
  | { type: 'project'; status: 'facts' | 'souffle' | 'report' }
  | { type: 'done'; result: ProjectRunResult }
  | { type: 'error'; message: string }

export interface Diagnostic {
  severity: string
  message: string
  formattedMessage?: string
}

export interface StorageLayoutEntry {
  label: string
  slot: string
  offset: number
  type: string
  astId: number
}

export interface ContractStorageLayout {
  contract: string
  storage: StorageLayoutEntry[]
  types: Record<
    string,
    { label: string; numberOfBytes: string; encoding: string }
  >
}

export interface Column {
  name: string
  type: string
}

export interface ProgramSection {
  kind: 'section'
  title: string
  text: string
  line: number
  file: string
}

export interface ProgramDecl {
  kind: 'decl'
  relation: string
  columns: Column[]
  comment: string
  line: number
  file: string
}

export interface ProgramClause {
  kind: 'clause'
  head: string
  text: string
  comment: string
  line: number
  endLine: number
  file: string
}

export type ProgramItem = ProgramSection | ProgramDecl | ProgramClause

export interface RelationInfo {
  name: string
  columns: Column[]
  comment: string
  file: string
  line: number
  isInput: boolean
  isOutput: boolean
  clauseCount: number
  section: string
}

export interface Program {
  text: string
  items: ProgramItem[]
  relations: RelationInfo[]
}

/** Rows of one relation, split into columns. Base facts and derived relations share this shape. */
export interface FactRelation {
  relation: string
  rows: string[][]
}

export interface DerivedRelation {
  relation: string
  rows: string[][]
}

export interface Timings {
  resolveMs: number
  compileMs: number
  emitMs: number
  souffleMs: number
  reportMs: number
}

export interface RunResult {
  runId: string
  runDir: string
  unit: string
  /** Set when this run is one unit of a project run: its slug under units/ (for /api/explain and /api/ask). */
  unitSlug?: string
  source: string
  compile: {
    constraints: string[]
    solcVersion: string
    resolvedFrom: string
    backend: string
    warnings: number
    input: unknown
    diagnostics: Diagnostic[]
  }
  ast: AstNode
  storageLayout: ContractStorageLayout[]
  /** Layer 0: the AST as facts (rules/schema.dl), exactly what Soufflé read from disk. */
  facts: FactRelation[]
  /** Yul nodes got synthetic ids above the largest solc id; this many. */
  syntheticIds: number
  program: Program
  /** Everything Soufflé derived, concept relations (rules/concepts.dl) included. */
  derived: DerivedRelation[]
  souffle: { version: string; command: string; stderr: string }
  timings: Timings
  report: string
  files: string[]
}

export type ProofKind =
  | 'derived'
  | 'fact'
  | 'negation'
  | 'constraint'
  | 'missing'

export interface ProofNode {
  kind: ProofKind
  /** The atom as Soufflé prints it, e.g. `writes("a", "b")` or `412 != 410`. */
  text: string
  /** Soufflé's rule number within the head relation, e.g. "R2" (derived nodes only). */
  ruleNumber?: string
  /** The rule as Soufflé sees it after its own rewriting (disjunctions split, wildcards named). */
  rule?: string
  children: ProofNode[]
}

export interface ExplainRequest {
  runId: string
  /** A unit inside a project run (its slug under units/); the project program itself otherwise. */
  unit?: string
  relation: string
  cols: string[]
}

export interface ExplainResult {
  atom: string
  proof: ProofNode
  ms: number
}

// ---------- step 7: ask an AI about the run (web/server/ask.ts drives the `codex` CLI) ----------

export interface ModelChoice {
  slug: string
  label: string
  efforts: string[]
}

/** What the server knows about the `codex` CLI it drives, and the defaults the ask box starts with. */
export interface AskConfig {
  /** CODEX_MODEL / CODEX_EFFORT environment variables, else gpt-5.6-sol at high. */
  model: string
  effort: string
  models: ModelChoice[]
  codex: { command: string; version?: string; error?: string }
  /** Where every transcript goes, relative to the run folder. */
  transcriptDir: string
}

export interface AskRequest {
  runId: string
  /** A unit inside a project run (its slug under units/): ask about that unit instead of the project. */
  unit?: string
  question: string
  model: string
  effort: string
  /** Codex thread to continue for a follow-up question; omitted for a fresh conversation. */
  threadId?: string
}

/** One line of the NDJSON stream `POST /api/ask` answers with, in the order things happen. */
export type AskEvent =
  | { type: 'started'; threadId: string; command: string }
  | { type: 'reasoning'; text: string }
  | {
      type: 'command'
      id: string
      command: string
      status: 'running' | 'completed' | 'failed'
      exitCode?: number
      output?: string
    }
  | { type: 'note'; text: string }
  /** An agent message; the last one before `done` is the answer. */
  | { type: 'message'; text: string }
  | {
      type: 'done'
      ms: number
      exitCode: number | null
      usage?: Record<string, number>
      /** Transcript written into the run folder, relative to it. */
      transcript?: string
    }
  | { type: 'error'; message: string }
