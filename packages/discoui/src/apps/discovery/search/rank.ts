export const NO_MATCH = Number.NEGATIVE_INFINITY

export interface SearchQuery {
  normalized: string
  tokens: string[]
}

export function toSearchQuery(text: string): SearchQuery {
  const tokens = text
    .toLowerCase()
    .split(' ')
    .filter((t) => t.length > 0)
  return { normalized: tokens.join(' '), tokens }
}

export function toSearchTerms(terms: (string | undefined)[]): string[] {
  const result: string[] = []
  for (const term of terms) {
    if (term === undefined) continue
    const normalized = term.toLowerCase().trim()
    if (normalized.length > 0) result.push(normalized)
  }
  return result
}

export function rankSearchTerms(terms: string[], query: SearchQuery): number {
  if (query.tokens.length === 0) {
    return 0
  }
  if (!query.tokens.every((token) => terms.some((t) => t.includes(token)))) {
    return NO_MATCH
  }
  for (const [index, term] of terms.entries()) {
    if (!query.tokens.every((token) => term.includes(token))) continue
    return 1_000 - index * 100 + rankTerm(term, query.normalized)
  }
  return 0
}

function rankTerm(term: string, normalizedQuery: string): number {
  if (term === normalizedQuery) return 3
  if (term.startsWith(normalizedQuery)) return 2
  if (term.includes(normalizedQuery)) return 1
  return 0
}

export interface TextSegment {
  text: string
  highlighted: boolean
}

export function highlightSegments(
  text: string,
  needles: string[],
): TextSegment[] {
  const lower = text.toLowerCase()
  const marked = new Array<boolean>(text.length).fill(false)
  for (const needle of needles) {
    if (needle.length === 0) continue
    const lowerNeedle = needle.toLowerCase()
    let from = lower.indexOf(lowerNeedle)
    while (from !== -1) {
      marked.fill(true, from, from + lowerNeedle.length)
      from = lower.indexOf(lowerNeedle, from + lowerNeedle.length)
    }
  }

  const segments: TextSegment[] = []
  let start = 0
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marked[i] !== marked[start]) {
      segments.push({
        text: text.slice(start, i),
        highlighted: marked[start] ?? false,
      })
      start = i
    }
  }
  return segments
}
