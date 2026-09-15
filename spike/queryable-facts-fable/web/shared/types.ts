// Types shared by the server (web/server) and the client (web/client).

import type { Example } from '../../src/examples'
import type { Level } from '../../src/levels'
import type { Column, Program, RelationInfo } from '../../src/program'
import type { RunMeta } from '../../src/run'
import type { ProofNode } from '../../src/souffle'

export type {
  Column,
  Example,
  Level,
  Program,
  ProofNode,
  RelationInfo,
  RunMeta,
}

export interface State {
  levels: Array<Omit<Level, 'text'>>
  examples: Example[]
}

export interface RelationView extends RelationInfo {
  /** From `// strength: <word>` in the comment; undefined for helpers. */
  strength?: string
  /** Level number of the file the relation is declared in. */
  level: number
  rows: number
}

export interface RunView {
  meta: RunMeta
  /** Every relation of the program, inputs and outputs and helpers, with row counts where known. */
  relations: RelationView[]
  /** Rule files 0..level, in order. */
  files: Array<{ name: string; level: number; text: string }>
}

export interface RowsResult {
  relation: string
  columns: Column[]
  total: number
  rows: string[][]
}

export interface ExplainResult {
  atom: string
  proof: ProofNode
  ms: number
}
