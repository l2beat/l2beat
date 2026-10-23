import { SearchQuery } from '@codemirror/search'
import {
  EditorSelection,
  type EditorState,
  type SelectionRange,
} from '@codemirror/state'

export const MATCH_COUNT_MAX = 10_000

export interface Matches {
  froms: number[]
  tos: number[]
  truncated: boolean
}

export function findMatches(state: EditorState, query: SearchQuery): Matches {
  const matches: Matches = { froms: [], tos: [], truncated: false }
  if (!query.valid) {
    return matches
  }
  const cursor = toRegExpQuery(query).getCursor(state)
  for (let next = cursor.next(); !next.done; next = cursor.next()) {
    if (matches.froms.length === MATCH_COUNT_MAX) {
      matches.truncated = true
      break
    }
    matches.froms.push(next.value.from)
    matches.tos.push(next.value.to)
  }
  return matches
}

export function firstMatchFrom(
  state: EditorState,
  query: SearchQuery,
  position: number,
): SelectionRange | undefined {
  if (!query.valid) {
    return undefined
  }
  const fast = toRegExpQuery(query)
  const after = fast.getCursor(state, position).next()
  const match = after.done ? fast.getCursor(state, 0, position).next() : after
  if (match.done) {
    return undefined
  }
  return EditorSelection.range(match.value.from, match.value.to)
}

// CodeMirror's plain text cursor is ~50x slower than its regexp cursor.
function toRegExpQuery(query: SearchQuery): SearchQuery {
  if (query.regexp) {
    return query
  }
  const text = query.literal ? query.search : unquote(query.search)
  return new SearchQuery({
    search: escapeRegExp(text),
    regexp: true,
    caseSensitive: query.caseSensitive,
    wholeWord: query.wholeWord,
  })
}

function unquote(text: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const escaped = text[i] === '\\' ? UNQUOTED[text[i + 1] ?? ''] : undefined
    if (escaped === undefined) {
      result += text[i]
    } else {
      result += escaped
      i++
    }
  }
  return result
}

const UNQUOTED: Record<string, string> = {
  n: '\n',
  r: '\r',
  t: '\t',
  '\\': '\\',
}

// The u flag allows escaping only syntax characters, and the cursor matches
// across lines only for a pattern with \n or \r.
function escapeRegExp(text: string): string {
  let result = ''
  for (const character of text) {
    if (character === '\n') {
      result += '\\n'
    } else if (character === '\r') {
      result += '\\r'
    } else if (REGEXP_SYNTAX.includes(character)) {
      result += `\\${character}`
    } else {
      result += character
    }
  }
  return result
}

const REGEXP_SYNTAX = '^$\\.*+?()[]{}|'

export function counterText(
  query: SearchQuery,
  matches: Matches,
  selection: SelectionRange,
): string {
  if (query.search === '') {
    return ''
  }
  if (!query.valid) {
    return 'Invalid'
  }
  const count = matches.froms.length
  if (count === 0) {
    return 'No results'
  }
  const total = matches.truncated ? `${count}+` : `${count}`
  const index = lowerBound(matches.froms, selection.from)
  const isCurrent =
    matches.froms[index] === selection.from &&
    matches.tos[index] === selection.to
  return `${isCurrent ? index + 1 : '?'} of ${total}`
}

function lowerBound(values: number[], target: number): number {
  let low = 0
  let high = values.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if ((values[middle] as number) < target) {
      low = middle + 1
    } else {
      high = middle
    }
  }
  return low
}
