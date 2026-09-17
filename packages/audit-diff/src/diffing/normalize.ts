/**
 * Minimal normalization applied to both sides before comparing and diffing.
 * Formatting (indentation, quotes) is deliberately NOT normalized: the
 * dataset formats both sides with one forge fmt config, and the engine must
 * not hide differences in the displayed diff.
 */
export function normalizeSource(text: string): string {
  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
  while (lines.length > 0 && lines[0] === '') lines.shift()
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  return lines.join('\n')
}

export function countLines(text: string): number {
  return text === '' ? 0 : text.split('\n').length
}

/**
 * Ignored differences
 * -------------------
 * Some changes never make a deployed unit "differ" from its audited version:
 *   1. comments (`//` and `/* *\/`, including NatSpec),
 *   2. the string messages of `require(...)` and `revert(...)` calls.
 * `comparableText` is the code with both removed and whitespace collapsed;
 * two units are identical when their comparable texts are equal.
 * `comparableLines` applies the same removal line by line (line count is
 * preserved) so single diff lines can be classified as ignored.
 */
export function comparableText(text: string): string {
  return stripRequireMessages(stripComments(text))
    .replace(/,\s*\)/g, ')') // dangling comma left by a removed message
    .replace(/\s+/g, ' ')
    .trim()
}

export function comparableLines(text: string): string[] {
  return stripRequireMessages(stripComments(text))
    .split('\n')
    .map((line) =>
      line
        .replace(/,\s*\)/g, ')')
        .replace(/\s+/g, ' ')
        .trim(),
    )
}

/**
 * Removes comments while keeping every newline, so that line numbers of the
 * result match the input. String literals are copied verbatim.
 */
export function stripComments(text: string): string {
  let out = ''
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    const next = text[i + 1]
    if (ch === '"' || ch === "'") {
      const end = findStringEnd(text, i)
      out += text.slice(i, end + 1)
      i = end + 1
    } else if (ch === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++
    } else if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2)
      const stop = end === -1 ? text.length : end + 2
      // keep the newlines of a multi-line comment
      out += text.slice(i, stop).replace(/[^\n]/g, '')
      i = stop
    } else {
      out += ch
      i++
    }
  }
  return out
}

/**
 * Removes string literals inside `require(...)` and `revert(...)` calls, i.e.
 * the error messages. Newlines are kept. Expects comment-free input.
 */
export function stripRequireMessages(text: string): string {
  const re = /\b(require|revert)\s*\(/g
  let out = ''
  let last = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const open = m.index + m[0].length - 1
    const close = findMatchingParen(text, open)
    if (close === -1) break
    out += text.slice(last, open + 1)
    out += removeStringLiterals(text.slice(open + 1, close))
    last = close
    re.lastIndex = close
  }
  return out + text.slice(last)
}

function removeStringLiterals(text: string): string {
  let out = ''
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === '"' || ch === "'") {
      i = findStringEnd(text, i) + 1
    } else {
      out += ch
      i++
    }
  }
  return out
}

/** Index of the closing quote of the string literal starting at `start`. */
function findStringEnd(text: string, start: number): number {
  const quote = text[start]
  let j = start + 1
  while (j < text.length && text[j] !== quote) {
    if (text[j] === '\\') j++
    j++
  }
  return Math.min(j, text.length - 1)
}

/** Index of the `)` matching the `(` at `open`, skipping string literals. */
function findMatchingParen(text: string, open: number): number {
  let depth = 0
  for (let i = open; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"' || ch === "'") {
      i = findStringEnd(text, i)
    } else if (ch === '(') {
      depth++
    } else if (ch === ')') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}
