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
