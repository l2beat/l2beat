// Past these the agent reads the rest from the .flat file.
const EXCERPT_LINES_MAX = 60
const CONTEXT_LINES = 12

export interface CodeExcerpt {
  line: number
  lines: string[]
  isCut: boolean
}

// What a step points at, so the agent reads the code before it says what the
// code does: the whole function, modifier or block the snippet opens, or the
// lines after a snippet that opens none.
export function excerptAt(
  code: string,
  offset: number,
  line: number,
): CodeExcerpt {
  const start = code.lastIndexOf('\n', offset - 1) + 1
  const block = blockEnd(code, offset)
  const end = block ?? endOfLines(code, start, CONTEXT_LINES)
  const lines = code.slice(start, end).split('\n')
  return {
    line,
    lines: lines.slice(0, EXCERPT_LINES_MAX),
    // Lines after a statement are only its context: the rest of the
    // function is cut too.
    isCut:
      lines.length > EXCERPT_LINES_MAX ||
      (block === undefined && end < code.trimEnd().length),
  }
}

function blockEnd(code: string, offset: number): number | undefined {
  const open = blockOpen(code, offset)
  const close = open === undefined ? undefined : closingBrace(code, open)
  return close === undefined ? undefined : endOfLines(code, close, 1)
}

// A snippet opens a block when a brace comes before the statement ends.
// Semicolons in parentheses, like a for loop's, do not end it, and braces
// there, like named arguments, or before a call's parentheses, like
// `deposit{value: v}()`, do not open it. A snippet from inside a parameter
// list closes a parenthesis it never opened.
function blockOpen(code: string, offset: number): number | undefined {
  let parens = 0
  for (let at = offset; at < code.length; at++) {
    at = endOfCommentOrString(code, at)
    if (code[at] === '(') {
      parens++
    } else if (code[at] === ')') {
      parens = Math.max(parens - 1, 0)
    } else if (code[at] === '{' && parens === 0) {
      const close = closingBrace(code, at)
      if (close === undefined || code[nextCodeChar(code, close + 1)] !== '(') {
        return at
      }
      at = close
    } else if (code[at] === ';' && parens === 0) {
      return undefined
    }
  }
  return undefined
}

function closingBrace(code: string, open: number): number | undefined {
  let depth = 0
  for (let at = open; at < code.length; at++) {
    at = endOfCommentOrString(code, at)
    if (code[at] === '{') {
      depth++
    } else if (code[at] === '}') {
      depth--
      if (depth === 0) {
        return at
      }
    }
  }
  return undefined
}

// Call options keep their parentheses on the same line; a parenthesis on a
// later line starts the next statement, like a tuple assignment after a block.
function nextCodeChar(code: string, from: number): number {
  let at = from
  while (at < code.length && ' \t'.includes(code[at] as string)) {
    at++
  }
  return at
}

// Braces in comments and strings, like commented-out code, do not open or
// close a block: returns where the comment or string at `at` ends, or `at`.
function endOfCommentOrString(code: string, at: number): number {
  if (code.startsWith('//', at)) {
    const end = code.indexOf('\n', at)
    return end === -1 ? code.length : end
  }
  if (code.startsWith('/*', at)) {
    const end = code.indexOf('*/', at + 2)
    return end === -1 ? code.length : end + 1
  }
  const quote = code[at]
  if (quote !== '"' && quote !== "'") {
    return at
  }
  for (let i = at + 1; i < code.length; i++) {
    if (code[i] === '\\') {
      i++
    } else if (code[i] === quote) {
      return i
    }
  }
  return code.length
}

function endOfLines(code: string, from: number, count: number): number {
  let end = from
  for (let i = 0; i < count; i++) {
    const next = code.indexOf('\n', end + (i === 0 ? 0 : 1))
    if (next === -1) {
      return code.length
    }
    end = next
  }
  return end
}
