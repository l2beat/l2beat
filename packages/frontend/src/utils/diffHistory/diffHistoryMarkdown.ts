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

export function extractDiffBlocks(body: string): string[] {
  return extractDiffBlockSpans(body).map((span) => span.content)
}

export function countDiffChanges(body: string): number {
  let count = 0
  for (const block of extractDiffBlocks(body)) {
    for (const line of block.split('\n')) {
      if (line.startsWith('+++') || line.startsWith('---')) {
        continue
      }
      if (/^\s*[+-]\s/.test(line)) {
        count++
      }
    }
  }
  return count
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
