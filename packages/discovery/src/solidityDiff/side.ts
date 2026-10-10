// One side of the diff: its text, which characters are comments, and which
// lines changed.
export interface Side {
  source: string
  lines: string[]
  lineOfOffset: Int32Array
  comment: Uint8Array
  changed: Uint8Array
}

export function toSide(source: string): Side {
  const lines = source.split('\n')
  const lineOfOffset = new Int32Array(source.length + 1)
  let start = 0
  for (let line = 0; line < lines.length; line++) {
    const end = start + (lines[line] as string).length + 1
    lineOfOffset.fill(line, start, end)
    start = end
  }
  return {
    source,
    lines,
    lineOfOffset,
    comment: commentMask(source),
    changed: new Uint8Array(lines.length),
  }
}

export function lineOf(side: Side, offset: number): number {
  return side.lineOfOffset[offset] as number
}

export function isWhitespace(c: string): boolean {
  return c === ' ' || c === '\t' || c === '\r' || c === '\n'
}

// Strings are skipped so that a `//` inside one is not taken for a comment.
function commentMask(source: string): Uint8Array {
  const comment = new Uint8Array(source.length)
  let i = 0
  while (i < source.length) {
    const c = source[i] as string
    const next = source[i + 1]
    if (c === '/' && next === '/') {
      const newline = source.indexOf('\n', i)
      const end = newline === -1 ? source.length : newline
      comment.fill(1, i, end)
      i = end
    } else if (c === '/' && next === '*') {
      const close = source.indexOf('*/', i + 2)
      const end = close === -1 ? source.length : close + 2
      comment.fill(1, i, end)
      i = end
    } else if (c === '"' || c === "'") {
      i = stringEnd(source, i)
    } else {
      i++
    }
  }
  return comment
}

export function stringEnd(source: string, start: number): number {
  let i = start + 1
  while (
    i < source.length &&
    source[i] !== source[start] &&
    source[i] !== '\n'
  ) {
    i += source[i] === '\\' ? 2 : 1
  }
  return i + 1
}
