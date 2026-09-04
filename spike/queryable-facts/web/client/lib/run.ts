// Everything the client needs to cross-reference one run: AST nodes by id/src, source ranges
// of ids, which fact rows came from which line or node, id kinds and short labels.

import { type AstNode, childNodes, isNode, parseSrc } from '../../../src/ast'
import type {
  FactRow,
  Origin,
  RelationInfo,
  RunResult,
} from '../../shared/types'

/** Half-open range of UTF-16 code units into the source string. */
export interface Range {
  start: number
  end: number
}

export interface RowRef {
  relation: string
  index: number
}

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

export class RunIndex {
  readonly source: string
  readonly nodesById = new Map<number, AstNode>()
  readonly nodesBySrc = new Map<string, AstNode>()
  readonly parentOf = new Map<AstNode, AstNode>()
  readonly locs = new Map<string, Loc>()
  readonly idKinds = new Map<string, IdKind>()
  readonly facts = new Map<string, FactRow[]>()
  readonly derived = new Map<string, string[][]>()
  readonly relations = new Map<string, RelationInfo>()
  readonly rowsByLine = new Map<number, RowRef[]>()
  readonly rowsByNodeId = new Map<number, RowRef[]>()
  readonly rowsBySrc = new Map<string, RowRef[]>()
  readonly factCount: number
  readonly derivedCount: number
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

    for (const { relation, rows } of run.facts) this.facts.set(relation, rows)
    for (const { relation, rows } of run.derived)
      this.derived.set(relation, rows)
    for (const info of run.program.relations)
      this.relations.set(info.name, info)
    this.factCount = run.facts.reduce((n, f) => n + f.rows.length, 0)
    this.derivedCount = run.derived.reduce((n, d) => n + d.rows.length, 0)

    for (const row of this.facts.get('sourceLoc') ?? []) {
      const [
        id = '',
        ,
        startLine = '0',
        endLine = '0',
        start = '0',
        length = '0',
      ] = row.cols
      this.locs.set(id, {
        startLine: Number(startLine),
        endLine: Number(endLine),
        start: Number(start),
        length: Number(length),
      })
    }
    const kind = (
      relation: string,
      col: number,
      k: IdKind | ((cols: string[]) => IdKind),
    ) => {
      for (const row of this.facts.get(relation) ?? []) {
        const id = row.cols[col]
        if (id) this.idKinds.set(id, typeof k === 'function' ? k(row.cols) : k)
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

    for (const { relation, rows } of run.facts) {
      rows.forEach((row, index) => {
        const ref = { relation, index }
        const origin = row.origin
        if (!origin) return
        if (origin.id !== undefined) push(this.rowsByNodeId, origin.id, ref)
        push(this.rowsBySrc, origin.src, ref)
        const range = this.rangeOfSrc(origin.src)
        push(this.rowsByLine, this.lineOf(range.start), ref)
      })
    }
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

  rangeOfId(id: string): Range | undefined {
    const loc = this.locs.get(id)
    if (!loc) return undefined
    return {
      start: this.toChar(loc.start),
      end: this.toChar(loc.start + loc.length),
    }
  }

  rangeOfOrigin(origin: Origin | undefined): Range | undefined {
    return origin ? this.rangeOfSrc(origin.src) : undefined
  }

  nodeOfOrigin(origin: Origin | undefined): AstNode | undefined {
    if (!origin) return undefined
    if (origin.id !== undefined) return this.nodesById.get(origin.id)
    return this.nodesBySrc.get(origin.src)
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

  row(ref: RowRef): FactRow | undefined {
    return this.facts.get(ref.relation)?.[ref.index]
  }

  isId(value: string): boolean {
    return this.idKinds.has(value) || this.locs.has(value)
  }

  kindOf(id: string): IdKind {
    return this.idKinds.get(id) ?? (this.locs.has(id) ? 'other' : 'other')
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

  /** Recovers the columns of an atom printed by Soufflé (base fact or derived tuple). */
  matchAtom(
    text: string,
  ): { relation: string; cols: string[]; isFact: boolean } | undefined {
    const relation = /^(\w+)\(/.exec(text)?.[1]
    if (!relation) return undefined
    let cache = this.atomCache.get(relation)
    if (!cache) {
      cache = new Map()
      for (const row of this.facts.get(relation) ?? [])
        cache.set(this.formatAtom(relation, row.cols), row.cols)
      for (const cols of this.derived.get(relation) ?? [])
        cache.set(this.formatAtom(relation, cols), cols)
      this.atomCache.set(relation, cache)
    }
    const cols = cache.get(text)
    if (!cols) return undefined
    return { relation, cols, isFact: this.facts.has(relation) }
  }

  /** Index of a base fact row by its columns. */
  findFactRow(relation: string, cols: string[]): RowRef | undefined {
    const rows = this.facts.get(relation) ?? []
    const key = cols.join('\t')
    const index = rows.findIndex((r) => r.cols.join('\t') === key)
    return index >= 0 ? { relation, index } : undefined
  }
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

export { isNode }
