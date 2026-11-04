import { assert } from '@l2beat/shared-pure'
import { type CodeMatch, lineAt } from './codeAnchor'

export const EXCERPT_LINES_MAX = 60
export const EXCERPT_CHARACTERS_MAX = 8_000
// Lines above the snippet a cut excerpt keeps, so the agent sees how the
// code gets there.
const LEAD_LINES = 10

export interface Excerpt {
  text: string
  isCut: boolean
}

// What the agent reads for a step, numbered as DiscoUI numbers it: the whole
// declaration around the snippet, or the snippet's lines when it is in none.
export function excerptAt(
  code: string,
  match: CodeMatch,
  snippetLength: number,
): Excerpt {
  const span = match.declaration ?? {
    start: match.offset,
    end: match.offset + snippetLength,
  }
  const firstLine = lineAt(code, span.start)
  const lastLine = lineAt(code, Math.max(span.start, span.end - 1))
  assert(firstLine <= match.line, 'Snippet before its declaration')
  assert(match.line <= lastLine, 'Snippet after its declaration')
  const lines = code.split('\n')
  const start = Math.max(
    firstLine,
    Math.min(match.line - LEAD_LINES, lastLine - EXCERPT_LINES_MAX + 1),
  )
  const end = Math.min(lastLine, start + EXCERPT_LINES_MAX - 1)
  const width = String(end).length
  const numbered: string[] = []
  for (let line = start; line <= end; line++) {
    numbered.push(`${String(line).padStart(width)}  ${lines[line - 1] ?? ''}`)
  }
  const isWindowCut = start > firstLine || end < lastLine
  const cut = cutText(numbered.join('\n'), EXCERPT_CHARACTERS_MAX)
  return { text: cut.text, isCut: isWindowCut || cut.isCut }
}

// Cuts at a line end, so no line is left half shown.
export function cutText(text: string, charactersMax: number): Excerpt {
  assert(charactersMax >= 0, 'Negative limit')
  if (text.length <= charactersMax) {
    return { text, isCut: false }
  }
  const lineEnd = text.lastIndexOf('\n', charactersMax)
  const end = lineEnd === -1 ? charactersMax : lineEnd
  return { text: text.slice(0, end), isCut: true }
}
