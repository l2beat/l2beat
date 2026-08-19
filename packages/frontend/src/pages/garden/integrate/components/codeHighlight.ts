// A deliberately small, lenient highlighter for the two languages this page
// shows. Lenient is the requirement, not a shortcut: the response examples
// contain `...` and `…` where fields are elided, so a real JSON parser would
// reject every one of them. This scans and never throws - anything it does not
// recognise falls through as plain text.

export type CodeLanguage = 'json' | 'html' | 'text'

export type TokenKind =
  | 'key'
  | 'string'
  | 'number'
  | 'keyword'
  | 'tag'
  | 'attr'
  | 'punct'
  | 'elision'
  | 'plain'

export interface Token {
  kind: TokenKind
  text: string
}

export function tokenize(code: string, language: CodeLanguage): Token[] {
  if (language === 'json') return tokenizeJson(code)
  if (language === 'html') return tokenizeHtml(code)
  return [{ kind: 'plain', text: code }]
}

function tokenizeJson(code: string): Token[] {
  const out: Token[] = []
  let i = 0

  while (i < code.length) {
    const ch = code[i] as string

    if (ch === '"') {
      const end = readString(code, i)
      const text = code.slice(i, end)
      // A string is a key only when the next non-space character is a colon.
      let j = end
      while (j < code.length && /\s/.test(code[j] as string)) j++
      out.push({ kind: code[j] === ':' ? 'key' : 'string', text })
      i = end
      continue
    }

    if (ch === '.' || ch === '…') {
      const start = i
      while (i < code.length && (code[i] === '.' || code[i] === '…')) i++
      out.push({ kind: 'elision', text: code.slice(start, i) })
      continue
    }

    if (/[-\d]/.test(ch)) {
      const start = i
      while (i < code.length && /[-\d.eE+]/.test(code[i] as string)) i++
      out.push({ kind: 'number', text: code.slice(start, i) })
      continue
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const start = i
      while (i < code.length && /[\w-]/.test(code[i] as string)) i++
      const text = code.slice(start, i)
      out.push({
        kind: /^(true|false|null)$/.test(text) ? 'keyword' : 'plain',
        text,
      })
      continue
    }

    if (/[{}[\],:]/.test(ch)) {
      out.push({ kind: 'punct', text: ch })
      i++
      continue
    }

    const start = i
    while (i < code.length && /[^"{}[\],:.\w…-]/.test(code[i] as string)) i++
    out.push({ kind: 'plain', text: code.slice(start, Math.max(i, start + 1)) })
    if (i === start) i++
  }

  return merge(out)
}

function tokenizeHtml(code: string): Token[] {
  const out: Token[] = []
  let i = 0

  while (i < code.length) {
    if (code[i] !== '<') {
      const start = i
      while (i < code.length && code[i] !== '<') i++
      out.push({ kind: 'plain', text: code.slice(start, i) })
      continue
    }

    // Inside a tag: `<name attr="value" …>`, `</name>`, `/>`.
    out.push({ kind: 'punct', text: code[i + 1] === '/' ? '</' : '<' })
    i += code[i + 1] === '/' ? 2 : 1

    const nameStart = i
    while (i < code.length && /[\w:-]/.test(code[i] as string)) i++
    if (i > nameStart) out.push({ kind: 'tag', text: code.slice(nameStart, i) })

    while (i < code.length && code[i] !== '>') {
      const ch = code[i] as string
      if (/\s/.test(ch)) {
        const start = i
        while (i < code.length && /\s/.test(code[i] as string)) i++
        out.push({ kind: 'plain', text: code.slice(start, i) })
        continue
      }
      if (ch === '"') {
        const end = readString(code, i)
        out.push({ kind: 'string', text: code.slice(i, end) })
        i = end
        continue
      }
      if (ch === '=' || ch === '/') {
        out.push({ kind: 'punct', text: ch })
        i++
        continue
      }
      const start = i
      while (i < code.length && /[\w:-]/.test(code[i] as string)) i++
      if (i === start) i++
      out.push({ kind: 'attr', text: code.slice(start, i) })
    }

    if (code[i] === '>') {
      out.push({ kind: 'punct', text: '>' })
      i++
    }
  }

  return merge(out)
}

/** Reads a double-quoted run starting at `start`, honouring backslash escapes. */
function readString(code: string, start: number): number {
  let i = start + 1
  while (i < code.length) {
    if (code[i] === '\\') {
      i += 2
      continue
    }
    if (code[i] === '"') return i + 1
    i++
  }
  return code.length
}

/** Fewer spans in the DOM, and a cleaner tree to read in devtools. */
function merge(tokens: Token[]): Token[] {
  const out: Token[] = []
  for (const token of tokens) {
    const last = out[out.length - 1]
    if (last && last.kind === token.kind) {
      last.text += token.text
    } else {
      out.push({ ...token })
    }
  }
  return out
}
