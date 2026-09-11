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

// Keys that hold type metadata rather than child nodes.
const SKIP_KEYS = new Set(['typeDescriptions', 'argumentTypes'])

/** Yields every direct child node (objects with nodeType/src), in key order. */
export function* childNodes(node: AstNode): Generator<AstNode> {
  for (const [key, value] of Object.entries(node)) {
    if (SKIP_KEYS.has(key)) continue
    if (isNode(value)) {
      yield value
    } else if (Array.isArray(value)) {
      for (const item of value) if (isNode(item)) yield item
    }
  }
}

/** Depth-first walk with parent tracking. Return false from visit to skip a subtree. */
export function walk(
  node: AstNode,
  visit: (node: AstNode, parent: AstNode | undefined) => boolean | undefined,
  parent?: AstNode,
): void {
  if (visit(node, parent) === false) return
  for (const child of childNodes(node)) walk(child, visit, node)
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

  range(node: AstNode): { start: number; end: number; length: number } {
    const { start, length } = parseSrc(node.src)
    return { start, end: start + Math.max(length - 1, 0), length }
  }

  /** Source text of a node, collapsed to one line (TSV-safe), truncated. */
  slice(node: AstNode, max = 200): string {
    const { start, length } = parseSrc(node.src)
    const raw = this.bytes.subarray(start, start + length).toString('utf8')
    const flat = raw.replace(/\s+/g, ' ').trim()
    return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
  }
}

/** Solidity type string → the short form Slither prints (used in signatures and labels). */
export function cleanType(typeString: string | undefined): string {
  if (!typeString) return '?'
  return typeString
    .replace(/^(struct|contract|enum|library|interface) /, '')
    .replace(/ (storage pointer|storage ref|memory|calldata)$/, '')
    .replace(/ (storage pointer|storage ref|memory|calldata)(?=[\[\]])/g, '')
}

export function typeStringOf(node: AstNode | undefined): string | undefined {
  const td = node?.typeDescriptions as { typeString?: string } | undefined
  return td?.typeString
}

export function typeIdentifierOf(node: AstNode | undefined): string {
  const td = node?.typeDescriptions as { typeIdentifier?: string } | undefined
  return td?.typeIdentifier ?? ''
}
