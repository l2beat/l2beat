// Past these the agent reads the rest from the .flat file.
const EXCERPT_LINES_MAX = 60
// A minified source or a long literal can put a whole contract on one line.
const EXCERPT_CHARS_MAX = 8_000
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
  const shown = takeChars(lines.slice(0, EXCERPT_LINES_MAX), EXCERPT_CHARS_MAX)
  return {
    line,
    lines: shown.lines,
    // Lines after a statement are only its context: the rest of the
    // function is cut too.
    isCut:
      shown.isCut ||
      lines.length > EXCERPT_LINES_MAX ||
      (block === undefined && end < code.trimEnd().length),
  }
}

function takeChars(
  lines: readonly string[],
  charsMax: number,
): { lines: string[]; isCut: boolean } {
  const taken: string[] = []
  let left = charsMax
  for (const line of lines) {
    if (line.length > left) {
      if (left > 0) taken.push(line.slice(0, left))
      return { lines: taken, isCut: true }
    }
    taken.push(line)
    left -= line.length + 1
  }
  return { lines: taken, isCut: false }
}

function blockEnd(code: string, offset: number): number | undefined {
  const open = blockOpen(code, offset)
  let close = open === undefined ? undefined : closingBrace(code, open)
  if (close === undefined) return undefined
  // An if goes on through its else, a try through its catch clauses.
  let next = continuationAfter(code, close)
  while (next !== undefined) {
    close = next
    next = continuationAfter(code, close)
  }
  return endOfLines(code, close, 1)
}

function continuationAfter(code: string, close: number): number | undefined {
  const at = nextCodeChar(code, close + 1)
  if (!startsWithWord(code, at, 'else') && !startsWithWord(code, at, 'catch')) {
    return undefined
  }
  const open = blockOpen(code, at)
  return open === undefined ? undefined : closingBrace(code, open)
}

function startsWithWord(code: string, at: number, word: string): boolean {
  if (!code.startsWith(word, at)) return false
  const after = code[at + word.length] ?? ' '
  return !isIdentifierChar(after)
}

function isIdentifierChar(char: string): boolean {
  const lower = char.toLowerCase()
  return (
    (lower >= 'a' && lower <= 'z') ||
    (char >= '0' && char <= '9') ||
    char === '_' ||
    char === '$'
  )
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
      if (close === undefined || !isCallOptions(code, at, close)) {
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

// Call options hold no statement, so no semicolon, and the call's parentheses
// follow them, on any line. A block holds statements, so a parenthesis after
// it, like a tuple assignment's, starts the next statement.
function isCallOptions(code: string, open: number, close: number): boolean {
  if (code.slice(open, close).includes(';')) {
    return false
  }
  return code[nextCodeChar(code, close + 1)] === '('
}

function nextCodeChar(code: string, from: number): number {
  let at = from
  while (at < code.length) {
    if (' \t\r\n'.includes(code[at] as string)) {
      at++
    } else if (code.startsWith('//', at) || code.startsWith('/*', at)) {
      at = endOfCommentOrString(code, at) + 1
    } else {
      return at
    }
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
