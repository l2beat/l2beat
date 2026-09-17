const DIFF_BLOCK_RE = /```diff\n([\s\S]*?)```/g

export interface DiffBlockSpan {
  content: string
  start: number
  end: number
}

export function extractDiffBlockSpans(body: string): DiffBlockSpan[] {
  const spans: DiffBlockSpan[] = []
  const re = new RegExp(DIFF_BLOCK_RE.source, 'g')
  for (const match of body.matchAll(re)) {
    spans.push({
      content: (match[1] ?? '').replace(/\n$/, ''),
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    })
  }
  return spans
}

export function countDiffChanges(body: string): number {
  return extractDiffBlockSpans(body)
    .map(({ content }) => countChangesInDiff(content.split('\n')))
    .reduce((sum, count) => sum + count, 0)
}

function countChangesInDiff(lines: string[]): number {
  let count = 0
  let previousWasChange = false

  for (const line of lines) {
    const isChange = isChangeLine(line)
    if (isChange && !previousWasChange) {
      count++
    }
    previousWasChange = isChange
  }

  return count
}

function isChangeLine(line: string): boolean {
  if (line.startsWith('+++') || line.startsWith('---')) {
    return false
  }
  return /^\s*[+-]\s/.test(line)
}

export function isHighSeverityDiffBody(body: string): boolean {
  if (/^\+\+\+ severity: HIGH\b/im.test(body)) {
    return true
  }

  return containsImplementationChange(body)
}

function containsImplementationChange(body: string): boolean {
  const lines = body.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (!mentionsImplementationField(line)) {
      continue
    }

    if (isDiffValueLine(line)) {
      return true
    }

    const nextMeaningfulLines = lines.slice(i + 1, i + 5)
    if (nextMeaningfulLines.some(isDiffValueLine)) {
      return true
    }
  }

  return false
}

function mentionsImplementationField(line: string): boolean {
  return /["']?\$?implementation["']?\s*:/i.test(line)
}

function isDiffValueLine(line: string): boolean {
  if (line.startsWith('+++') || line.startsWith('---')) {
    return false
  }

  return /^\s*[+-]\s+/.test(line)
}
