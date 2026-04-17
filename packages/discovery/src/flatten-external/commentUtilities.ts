function findLineStart(source: string, pos: number): number {
  while (pos > 0 && source[pos - 1] !== '\n') pos--
  return pos
}

// Walks backwards from `start` to include contiguous full-line comments.
// Trailing comments (e.g. `} // comment`) are not included.
export function findLeadingCommentStart(source: string, start: number): number {
  const lineStart = findLineStart(source, start)

  // Non-whitespace before declaration on same line means no leading comments
  if (source.slice(lineStart, start).trim()) {
    return start
  }

  let pos = lineStart
  let result = start

  while (pos > 0) {
    const prevLineStart = findLineStart(source, pos - 1)
    const prevLine = source.slice(prevLineStart, pos).trim()

    if (!prevLine) {
      pos = prevLineStart
      continue
    }

    if (prevLine.startsWith('//')) {
      result = pos = prevLineStart
      continue
    }

    const blockStart = getFullLineBlockCommentStart(
      source,
      prevLineStart,
      pos - 1,
      prevLine,
    )
    if (blockStart !== null) {
      result = pos = blockStart
      continue
    }

    break
  }

  return result
}

function getFullLineBlockCommentStart(
  source: string,
  lineStart: number,
  lineEnd: number,
  trimmed: string,
): number | null {
  let searchPos: number | undefined

  if (trimmed.endsWith('*/')) {
    const idx = source.lastIndexOf('*/', lineEnd + 1)
    if (idx >= lineStart) searchPos = idx - 1
  } else if (trimmed.startsWith('*') && !trimmed.startsWith('*/')) {
    const idx = source.indexOf('*', lineStart)
    if (idx <= lineEnd) searchPos = idx - 1
  }

  if (searchPos === undefined) return null

  const blockStart = findBlockCommentStart(source, searchPos)
  if (blockStart === -1) return null

  const blockLineStart = findLineStart(source, blockStart)
  return source.slice(blockLineStart, blockStart).trim() ? null : blockLineStart
}

function findBlockCommentStart(source: string, pos: number): number {
  for (let i = pos; i >= 1; i--) {
    if (source[i - 1] === '*' && source[i] === '/') return -1
    if (source[i - 1] === '/' && source[i] === '*') return i - 1
  }
  return -1
}
