// Layer 0: solc's answer, re-encoded as facts — and nothing else.
//
// The emitter has no opinion about Solidity. It walks the compact JSON AST that solc returned
// and writes down every object and every field exactly once, using a fixed encoding that
// depends only on the *shape* of the JSON, never on what a field means:
//
//   { nodeType, id, src, ... }   → node(Id, Type) + loc(Id, Src, Start, Len, Line, EndLine) + text(Id, Text)
//   field holding a node        → child(Parent, Field, Index, Child)
//   field holding a string/bool → attr(Id, Field, Value)
//   field holding a number      → num(Id, Field, Value)
//   field holding an array      → one row per element, with its index (child / attrList / numList)
//   field holding a plain object→ flattened with dotted keys ("typeDescriptions.typeString")
//
// Yul nodes (inline assembly) have no `id`; they get synthetic ids above the largest solc id.
// The storage layout is copied verbatim as well. Everything that *means* something — "this is
// a function", "this assignment writes that variable" — is derived from these rows by the
// rules in rules/concepts.dl, where it can be read, questioned and explained.

import type { SolidityOutput } from '@ethereum-sourcify/compilers-types'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { type AstNode, isNode, parseSrc, SourceText } from './ast'

/** Base relations and their arity. Every relation gets a `.facts` file, even when empty. */
export const BASE_RELATIONS: Record<string, number> = {
  unit: 3, // (Unit, File, Solc)
  node: 2, // (Id, Type)
  loc: 6, // (Id, Src, Start, Len, StartLine, EndLine)
  child: 4, // (Parent, Field, Index, Child)
  attr: 3, // (Id, Key, Value)  strings and booleans
  num: 3, // (Id, Key, Value)  numbers
  attrList: 4, // (Id, Key, Index, Value)  strings/booleans inside arrays (and inside objects inside arrays)
  numList: 4, // (Id, Key, Index, Value)  numbers inside arrays
  text: 2, // (Id, Text)  the source text under the node, one line, at most 200 chars
  storageLayout: 6, // (Contract, AstId, Label, Slot, Offset, Type)  solc's storageLayout, verbatim
}

/** Keys of a node object that the encoding consumes itself rather than emitting as attributes. */
const STRUCTURAL_KEYS = new Set(['id', 'nodeType', 'src'])

/** TSV-safe: no tabs or line breaks inside a cell. Whitespace runs collapse to one space. */
function cell(value: string): string {
  return value.replace(/[\t\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Decimal text → number when it fits comfortably in Soufflé's 64-bit `number`, else -1. */
function safeNumber(text: string | number): number {
  try {
    const big = BigInt(text)
    return big >= 0n && big < 2n ** 53n ? Number(big) : -1
  } catch {
    return -1
  }
}

export class Facts {
  readonly rows = new Map<string, Set<string>>()

  constructor(readonly arity: Record<string, number>) {
    for (const name of Object.keys(arity)) this.rows.set(name, new Set())
  }

  add(relation: string, ...cols: Array<string | number>): void {
    const expected = this.arity[relation]
    if (expected === undefined) throw new Error(`unknown relation ${relation}`)
    if (cols.length !== expected) {
      throw new Error(
        `${relation} expects ${expected} columns, got ${cols.length}: ${JSON.stringify(cols)}`,
      )
    }
    const row = cols
      .map((c) => (typeof c === 'number' ? String(c) : cell(c)))
      .join('\t')
    this.rows.get(relation)?.add(row)
  }

  count(relation: string): number {
    return this.rows.get(relation)?.size ?? 0
  }

  total(): number {
    let n = 0
    for (const set of this.rows.values()) n += set.size
    return n
  }

  /** Rows of one relation, split into columns, in file order (sorted). */
  entries(relation: string): string[][] {
    return [...(this.rows.get(relation) ?? [])]
      .sort()
      .map((row) => row.split('\t'))
  }

  /** Writes `<relation>.facts` files; returns total rows and bytes. */
  write(dir: string): { rows: number; bytes: number } {
    mkdirSync(dir, { recursive: true })
    let rows = 0
    let bytes = 0
    for (const [relation, set] of this.rows) {
      const sorted = [...set].sort()
      const content = sorted.length > 0 ? `${sorted.join('\n')}\n` : ''
      writeFileSync(join(dir, `${relation}.facts`), content)
      rows += sorted.length
      bytes += Buffer.byteLength(content)
    }
    return { rows, bytes }
  }
}

export interface EmitInput {
  unit: string
  fileName: string
  source: string
  output: SolidityOutput
  solcVersion: string
}

export interface EmitResult {
  facts: Facts
  /** How many nodes got synthetic ids (Yul nodes have none in solc's JSON). */
  syntheticIds: number
  /** Id of the SourceUnit root node. */
  rootId: number
}

type Json = unknown

function isPlainObject(value: Json): value is Record<string, Json> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** The largest `id` anywhere in the AST, so synthetic ids never collide with solc's. */
function maxId(value: Json): number {
  let max = -1
  const walk = (v: Json): void => {
    if (Array.isArray(v)) {
      for (const item of v) walk(item)
    } else if (isPlainObject(v)) {
      if (typeof v.id === 'number' && v.id > max) max = v.id
      for (const item of Object.values(v)) walk(item)
    }
  }
  walk(value)
  return max
}

export function emitFacts(input: EmitInput): EmitResult {
  const facts = new Facts(BASE_RELATIONS)
  const text = new SourceText(input.source)
  const ast = input.output.sources?.[input.fileName]?.ast
  if (!isNode(ast)) throw new Error(`no AST for ${input.fileName} in solc output`)

  facts.add('unit', input.unit, input.fileName, input.solcVersion)

  let nextSynthetic = maxId(ast) + 1
  let syntheticIds = 0

  const visit = (
    node: AstNode,
    parent?: { id: number; field: string; index: number },
  ): number => {
    let id: number
    if (typeof node.id === 'number') {
      id = node.id
    } else {
      id = nextSynthetic++
      syntheticIds++
    }
    facts.add('node', id, node.nodeType)
    if (typeof node.src === 'string') {
      const { start, length } = parseSrc(node.src)
      const end = start + Math.max(length - 1, 0)
      facts.add(
        'loc',
        id,
        node.src,
        start,
        length,
        text.lineAt(start),
        text.lineAt(end),
      )
      facts.add('text', id, text.slice(node))
    }
    if (parent) facts.add('child', parent.id, parent.field, parent.index, id)
    for (const [key, value] of Object.entries(node)) {
      if (STRUCTURAL_KEYS.has(key)) continue
      field(id, key, value)
    }
    return id
  }

  /** A field of node `id` that is not inside an array. */
  const field = (id: number, key: string, value: Json): void => {
    if (value === null || value === undefined) return
    if (isNode(value)) {
      visit(value, { id, field: key, index: 0 })
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => indexed(id, key, index, item))
    } else if (isPlainObject(value)) {
      for (const [k, v] of Object.entries(value)) field(id, `${key}.${k}`, v)
    } else if (typeof value === 'number') {
      facts.add('num', id, key, value)
    } else {
      facts.add('attr', id, key, String(value))
    }
  }

  /** Element `index` of an array field (possibly nested inside a plain object in that array). */
  const indexed = (id: number, key: string, index: number, value: Json) => {
    if (value === null || value === undefined) return
    if (isNode(value)) {
      visit(value, { id, field: key, index })
    } else if (Array.isArray(value)) {
      value.forEach((item, j) => indexed(id, `${key}[${j}]`, index, item))
    } else if (isPlainObject(value)) {
      for (const [k, v] of Object.entries(value))
        indexed(id, `${key}.${k}`, index, v)
    } else if (typeof value === 'number') {
      facts.add('numList', id, key, index, value)
    } else {
      facts.add('attrList', id, key, index, String(value))
    }
  }

  const rootId = visit(ast)

  const contracts = input.output.contracts?.[input.fileName] ?? {}
  for (const [name, contract] of Object.entries(contracts)) {
    const layout = contract.storageLayout
    if (!layout) continue
    for (const entry of layout.storage) {
      facts.add(
        'storageLayout',
        name,
        entry.astId,
        entry.label,
        safeNumber(entry.slot),
        entry.offset,
        entry.type,
      )
    }
  }

  return { facts, syntheticIds, rootId }
}
