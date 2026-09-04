// Types shared by the explorer's server (web/server) and client (web/client).

import type { AstNode } from '../../src/ast'
import type { FactRow } from '../../src/extract'

export type { AstNode, FactRow }
export type { Origin } from '../../src/extract'

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

export interface FactRelation {
  relation: string
  rows: FactRow[]
}

export interface DerivedRelation {
  relation: string
  rows: string[][]
}

export interface Timings {
  resolveMs: number
  compileMs: number
  extractMs: number
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
  facts: FactRelation[]
  program: Program
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
