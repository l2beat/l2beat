// Small helpers over solc's compact JSON AST.

export interface AstNode {
  id: number
  nodeType: string
  src: string
  [key: string]: unknown
}

export function isNode(value: unknown): value is AstNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AstNode).nodeType === 'string' &&
    typeof (value as AstNode).src === 'string'
  )
}

export function parseSrc(src: string): {
  start: number
  length: number
  file: number
} {
  const [start, length, file] = src.split(':').map(Number)
  return { start: start ?? 0, length: length ?? 0, file: file ?? 0 }
}

export class SourceText {
  // solc's `src` offsets count bytes, not UTF-16 code units: slice the UTF-8 bytes, not the string.
  private readonly bytes: Buffer
  private readonly lineStarts: number[] = [0]

  constructor(readonly text: string) {
    this.bytes = Buffer.from(text, 'utf8')
    for (let i = 0; i < this.bytes.length; i++) {
      if (this.bytes[i] === 0x0a) this.lineStarts.push(i + 1)
    }
  }

  /** 1-based line of a byte offset. */
  lineAt(offset: number): number {
    let lo = 0
    let hi = this.lineStarts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if ((this.lineStarts[mid] ?? 0) <= offset) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }

  /** Source text of a node, collapsed to one line (TSV-safe), truncated. */
  slice(node: AstNode, max = 200): string {
    const { start, length } = parseSrc(node.src)
    const raw = this.bytes.subarray(start, start + length).toString('utf8')
    const flat = raw.replace(/\s+/g, ' ').trim()
    return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
  }
}
