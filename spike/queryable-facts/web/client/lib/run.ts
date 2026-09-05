// Everything the client needs to cross-reference one run: AST nodes by id/src, which rows talk
// about which node, source ranges of ids, id kinds and short labels.
//
// Three layers of rows live here:
//   base     rules/schema.dl   the AST as facts (node, loc, child, attr, ...); a row's node is its Id column
//   concept  rules/concepts.dl function, stmt, callSite, writeSite, ...; a row's node comes from `located`
//   derived  lib.dl/report.dl  the analysis proper

import { type AstNode, childNodes, isNode, parseSrc } from '../../../src/ast'
import type { RelationInfo, RunResult } from '../../shared/types'

/** Half-open range of UTF-16 code units into the source string. */
export interface Range {
  start: number
  end: number
}

export interface RowRef {
  relation: string
  index: number
}

export type Layer = 'base' | 'concept' | 'derived'

export type IdKind =
  | 'contract'
  | 'function'
  | 'modifier'
  | 'variable'
  | 'param'
  | 'local'
  | 'stmt'
  | 'block'
  | 'call'
  | 'write'
  | 'assembly'
  | 'asm'
  | 'result'
  | 'event'
  | 'other'

export interface Loc {
  startLine: number
  endLine: number
  /** byte offset / length, as solc counts */
  start: number
  length: number
}

/** Base relations whose Id-like columns name AST nodes (column name → it is a node id). */
const NODE_COLUMNS = new Set(['Id', 'Parent', 'Child', 'AstId'])

/** For concept relations whose first id column is not the most specific thing to point at. */
const ANCHOR_COLUMN: Record<string, number> = {
  param: 2,
  storageSlot: 1,
  functionBody: 1,
  callResult: 1,
}

export class RunIndex {
  readonly source: string
  readonly nodesById = new Map<number, AstNode>()
  readonly nodesBySrc = new Map<string, AstNode>()
  readonly parentOf = new Map<AstNode, AstNode>()
  /** solc's `loc` rows: every node id (synthetic Yul ids included) → where it sits. */
  readonly locOfNode = new Map<number, Loc & { src: string }>()
  /** Symbolic ids (from `sourceLoc`) → where they sit. */
  readonly locs = new Map<string, Loc>()
  /** Symbolic ids → the node they were minted from (from `located`). */
  readonly nodeIdOf = new Map<string, number>()
  readonly idKinds = new Map<string, IdKind>()
  readonly base = new Map<string, string[][]>()
  readonly concepts = new Map<string, string[][]>()
  readonly derived = new Map<string, string[][]>()
  readonly relations = new Map<string, RelationInfo>()
  /** Base rows about a node (its Id column, or the Child column of `child`). */
  readonly baseRowsByNode = new Map<number, RowRef[]>()
  readonly baseRowsByLine = new Map<number, RowRef[]>()
  /** Concept rows anchored at a node / starting on a line. */
  readonly conceptRowsByNode = new Map<number, RowRef[]>()
  readonly conceptRowsByLine = new Map<number, RowRef[]>()
  readonly baseCount: number
  readonly conceptCount: number
  readonly derivedCount: number
  /** Helper relations of concepts.dl (tree reading, types, names, code): plumbing, not concepts. */
  readonly plumbing = new Set<string>()
  private readonly byteToChar: Uint32Array | undefined
  private readonly lineStarts: number[] = [0]
  private readonly atomCache = new Map<string, Map<string, string[]>>()

  constructor(readonly run: RunResult) {
    this.source = run.source
    // solc counts bytes; JS strings count UTF-16 units. Identity for ASCII files.
    let ascii = true
    for (let i = 0; i < this.source.length; i++) {
      if (this.source.charCodeAt(i) >= 0x80) {
        ascii = false
        break
      }
    }
    if (!ascii) {
      const bytes = new TextEncoder().encode(this.source)
      const map = new Uint32Array(bytes.length + 1)
      let byte = 0
      for (let i = 0; i < this.source.length; i++) {
        const code = this.source.codePointAt(i) ?? 0
        const units = code > 0xffff ? 2 : 1
        const width =
          code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4
        for (let b = 0; b < width; b++) map[byte + b] = i
        byte += width
        i += units - 1
      }
      map[byte] = this.source.length
      this.byteToChar = map
    }
    for (let i = 0; i < this.source.length; i++) {
      if (this.source.charCodeAt(i) === 0x0a) this.lineStarts.push(i + 1)
    }

    const visit = (node: AstNode, parent?: AstNode): void => {
      if (typeof node.id === 'number') this.nodesById.set(node.id, node)
      if (!this.nodesBySrc.has(node.src)) this.nodesBySrc.set(node.src, node)
      if (parent) this.parentOf.set(node, parent)
      for (const child of childNodes(node)) visit(child, node)
      // Yul AST hangs off InlineAssembly.AST; childNodes already yields it because it has nodeType/src.
    }
    visit(run.ast)

    for (const info of run.program.relations) {
      this.relations.set(info.name, info)
      if (info.file === 'concepts.dl' && /^1[abcd]\./.test(info.section))
        this.plumbing.add(info.name)
    }
    for (const { relation, rows } of run.facts) this.base.set(relation, rows)
    for (const { relation, rows } of run.derived) {
      if (this.relations.get(relation)?.file === 'concepts.dl')
        this.concepts.set(relation, rows)
      else this.derived.set(relation, rows)
    }
    this.baseCount = sum(this.base)
    this.conceptCount = sum(this.concepts)
    this.derivedCount = sum(this.derived)

    // loc(Id, Src, Start, Len, StartLine, EndLine)
    for (const row of this.base.get('loc') ?? []) {
      const [
        id = '',
        src = '',
        start = '0',
        length = '0',
        startLine = '0',
        endLine = '0',
      ] = row
      this.locOfNode.set(Number(id), {
        src,
        start: Number(start),
        length: Number(length),
        startLine: Number(startLine),
        endLine: Number(endLine),
      })
    }
    // sourceLoc(Id, File, StartLine, EndLine, Start, Length)
    for (const row of this.concepts.get('sourceLoc') ?? []) {
      const [
        id = '',
        ,
        startLine = '0',
        endLine = '0',
        start = '0',
        length = '0',
      ] = row
      this.locs.set(id, {
        startLine: Number(startLine),
        endLine: Number(endLine),
        start: Number(start),
        length: Number(length),
      })
    }
    // located(Id, N)
    for (const [id = '', n = ''] of this.concepts.get('located') ?? [])
      if (!this.nodeIdOf.has(id)) this.nodeIdOf.set(id, Number(n))

    const kind = (
      relation: string,
      col: number,
      k: IdKind | ((cols: string[]) => IdKind),
    ) => {
      for (const row of this.concepts.get(relation) ?? []) {
        const id = row[col]
        if (id) this.idKinds.set(id, typeof k === 'function' ? k(row) : k)
      }
    }
    kind('contract', 0, 'contract')
    kind('function', 0, (c) => (c[4] === 'modifier' ? 'modifier' : 'function'))
    kind('stateVariable', 0, 'variable')
    kind('param', 2, 'param')
    kind('localVar', 0, 'local')
    kind('event', 0, 'event')
    kind('stmt', 0, (c) =>
      c[2] === 'Block' || c[2] === 'UncheckedBlock' ? 'block' : 'stmt',
    )
    kind('callSite', 0, 'call')
    kind('writeSite', 0, 'write')
    kind('assembly', 0, 'assembly')
    kind('asmSstore', 0, 'asm')
    kind('asmCall', 0, 'asm')
    kind('callResult', 0, 'result')

    for (const [relation, rows] of this.base) {
      const info = this.relations.get(relation)
      const nodeCols = (info?.columns ?? [])
        .map((c, i) => (NODE_COLUMNS.has(c.name) ? i : -1))
        .filter((i) => i >= 0)
      if (nodeCols.length === 0) continue
      rows.forEach((row, index) => {
        const ref = { relation, index }
        for (const col of nodeCols) {
          const id = Number(row[col])
          if (Number.isNaN(id)) continue
          push(this.baseRowsByNode, id, ref)
        }
        const first = Number(row[nodeCols[0] ?? 0])
        const loc = this.locOfNode.get(first)
        if (loc) push(this.baseRowsByLine, loc.startLine, ref)
      })
    }
    for (const [relation, rows] of this.concepts) {
      rows.forEach((_row, index) => {
        const ref = { relation, index }
        const n = this.anchorNodeId(ref)
        if (n === undefined) return
        push(this.conceptRowsByNode, n, ref)
        const loc = this.locOfNode.get(n)
        if (loc) push(this.conceptRowsByLine, loc.startLine, ref)
      })
    }
  }

  layerOf(relation: string): Layer {
    if (this.base.has(relation)) return 'base'
    if (this.concepts.has(relation)) return 'concept'
    return 'derived'
  }

  rows(relation: string): string[][] {
    return (
      this.base.get(relation) ??
      this.concepts.get(relation) ??
      this.derived.get(relation) ??
      []
    )
  }

  row(ref: RowRef): string[] | undefined {
    return this.rows(ref.relation)[ref.index]
  }

  /** The AST node a row is about: base rows name it directly, concept rows through their ids. */
  anchorNodeId(ref: RowRef): number | undefined {
    const row = this.row(ref)
    if (!row) return undefined
    if (this.base.has(ref.relation)) {
      const info = this.relations.get(ref.relation)
      const col = (info?.columns ?? []).findIndex((c) => NODE_COLUMNS.has(c.name))
      if (col < 0) return undefined
      const id = Number(row[col])
      return Number.isNaN(id) ? undefined : id
    }
    const preferred = ANCHOR_COLUMN[ref.relation]
    if (preferred !== undefined) {
      const n = this.nodeIdOf.get(row[preferred] ?? '')
      if (n !== undefined) return n
    }
    for (const c of row) {
      const n = this.nodeIdOf.get(c)
      if (n !== undefined) return n
    }
    return undefined
  }

  anchorNode(ref: RowRef): AstNode | undefined {
    const id = this.anchorNodeId(ref)
    return id === undefined ? undefined : this.nodeOfNumId(id)
  }

  rangeOfRow(ref: RowRef): Range | undefined {
    const id = this.anchorNodeId(ref)
    return id === undefined ? undefined : this.rangeOfNodeId(id)
  }

  /** A node by solc id, or by synthetic id (Yul) through its `loc` row. */
  nodeOfNumId(id: number): AstNode | undefined {
    const direct = this.nodesById.get(id)
    if (direct) return direct
    const loc = this.locOfNode.get(id)
    return loc ? this.nodesBySrc.get(loc.src) : undefined
  }

  nodeOfSym(id: string): AstNode | undefined {
    const n = this.nodeIdOf.get(id)
    return n === undefined ? undefined : this.nodeOfNumId(n)
  }

  /** The number solc (or the emitter) gave a node; Yul nodes have none in the JSON. */
  numIdOf(node: AstNode): number | undefined {
    if (typeof node.id === 'number') return node.id
    for (const [id, loc] of this.locOfNode)
      if (loc.src === node.src && !this.nodesById.has(id)) return id
    return undefined
  }

  toChar(byte: number): number {
    if (!this.byteToChar) return byte
    return (
      this.byteToChar[Math.min(byte, this.byteToChar.length - 1)] ??
      this.source.length
    )
  }

  /** 1-based line of a char offset. */
  lineOf(offset: number): number {
    let lo = 0
    let hi = this.lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if ((this.lineStarts[mid] ?? 0) <= offset) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }

  lineRange(line: number): Range {
    const start = this.lineStarts[line - 1] ?? 0
    const end = this.lineStarts[line] ?? this.source.length
    return { start, end }
  }

  lineText(line: number): string {
    const { start, end } = this.lineRange(line)
    return this.source.slice(start, end).replace(/\n$/, '')
  }

  rangeOfSrc(src: string): Range {
    const { start, length } = parseSrc(src)
    return { start: this.toChar(start), end: this.toChar(start + length) }
  }

  rangeOfNode(node: AstNode): Range {
    return this.rangeOfSrc(node.src)
  }

  rangeOfNodeId(id: number): Range | undefined {
    const loc = this.locOfNode.get(id)
    if (!loc) return undefined
    return {
      start: this.toChar(loc.start),
      end: this.toChar(loc.start + loc.length),
    }
  }

  rangeOfId(id: string): Range | undefined {
    const loc = this.locs.get(id)
    if (!loc) return undefined
    return {
      start: this.toChar(loc.start),
      end: this.toChar(loc.start + loc.length),
    }
  }

  /** The innermost AST node whose range contains the char offset. */
  deepestNodeAt(offset: number): AstNode | undefined {
    let node: AstNode = this.run.ast
    for (;;) {
      let next: AstNode | undefined
      for (const child of childNodes(node)) {
        const r = this.rangeOfNode(child)
        if (offset >= r.start && offset < r.end) {
          next = child
          break
        }
      }
      if (!next) return node
      node = next
    }
  }

  ancestors(node: AstNode): AstNode[] {
    const out: AstNode[] = []
    let current = this.parentOf.get(node)
    while (current) {
      out.push(current)
      current = this.parentOf.get(current)
    }
    return out
  }

  isId(value: string): boolean {
    return this.idKinds.has(value) || this.locs.has(value)
  }

  kindOf(id: string): IdKind {
    return this.idKinds.get(id) ?? 'other'
  }

  /** Strips the `<unit>:` prefix and shortens site ids to `L<line> <text>`. */
  shortLabel(id: string): string {
    const unitPrefix = `${this.run.unit}:`
    let label = id.startsWith(unitPrefix) ? id.slice(unitPrefix.length) : id
    const kind = this.kindOf(id)
    if (kind === 'result') {
      const m = /^(.*)#(\d+)$/.exec(id)
      if (m?.[1]) return `result #${m[2]} of ${this.shortLabel(m[1])}`
    }
    if (kind === 'param' || kind === 'local') {
      const m = /\/([^/@]+)@\d+$/.exec(id)
      if (m?.[1]) return m[1]
    }
    const range = this.rangeOfId(id)
    if (range && /@\d+:\d+$/.test(id)) {
      const line = this.lineOf(range.start)
      const text = this.source
        .slice(range.start, range.end)
        .replace(/\s+/g, ' ')
        .trim()
      label = `L${line} ${text.length > 48 ? `${text.slice(0, 47)}…` : text}`
    }
    return label
  }

  /** Formats a tuple exactly like Soufflé's explain output, so proof leaves can be matched to rows. */
  formatAtom(relation: string, cols: string[]): string {
    const columns = this.relations.get(relation)?.columns ?? []
    const args = cols.map((c, i) =>
      columns[i]?.type === 'number' ? c : `"${c}"`,
    )
    return `${relation}(${args.join(', ')})`
  }

  /** Recovers the columns of an atom printed by Soufflé (base fact, concept or derived tuple). */
  matchAtom(
    text: string,
  ): { relation: string; cols: string[]; layer: Layer } | undefined {
    const relation = /^(\w+)\(/.exec(text)?.[1]
    if (!relation) return undefined
    let cache = this.atomCache.get(relation)
    if (!cache) {
      cache = new Map()
      for (const cols of this.rows(relation))
        cache.set(this.formatAtom(relation, cols), cols)
      this.atomCache.set(relation, cache)
    }
    const cols = cache.get(text)
    if (!cols) return undefined
    return { relation, cols, layer: this.layerOf(relation) }
  }

  /** Index of a row by its columns. */
  findRow(relation: string, cols: string[]): RowRef | undefined {
    const rows = this.rows(relation)
    const key = cols.join('\t')
    const index = rows.findIndex((r) => r.join('\t') === key)
    return index >= 0 ? { relation, index } : undefined
  }
}

function sum(map: Map<string, string[][]>): number {
  let n = 0
  for (const rows of map.values()) n += rows.length
  return n
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

export { isNode }
