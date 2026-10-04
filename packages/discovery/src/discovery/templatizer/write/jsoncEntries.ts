/**
 * Entries of an existing `template.jsonc`, cut out of its text verbatim,
 * with their offsets.
 *
 * An existing template is only ever added to: fields appended, review
 * notes inserted above a field. Parsing and re-serialising would drop every
 * comment and redo hand-made layout, so the writer inserts into the
 * original text at offsets found here, and the prompt shows existing
 * fields as the researcher wrote them. The scanner knows only as much JSONC
 * as that needs: strings with escapes, `//` and `/* *\/` comments,
 * brackets, colons and commas (trailing ones included).
 *
 * An entry owns the comments directly above it (no blank line in between)
 * and the comments after its value on the same line. A comment separated
 * from the next key by a blank line belongs to no entry: it is a note about
 * the file or a section, like the provenance header `renderTemplateFile`
 * writes.
 */

export interface JsoncEntry {
  key: string
  /** `"key": value` with its comments, without the comma that followed it. */
  text: string
  span: EntrySpan
}

/** Offsets into the source text, for inserting around an entry without rewriting it. */
export interface EntrySpan {
  /** Where the entry's text starts: its first leading comment, or its key. */
  start: number
  /** Where the key token starts. */
  keyStart: number
  /** Just past the value. A comma or a same-line comment may follow. */
  valueEnd: number
  /** Just past the entry: past its same-line trailing comment when it has one. */
  end: number
  /** Offset of the comma that followed the value, when there was one. */
  comma?: number
}

/** An object value with its members and the offsets of its braces. */
export interface JsoncObject {
  /** Offset of `{`. */
  open: number
  /** Offset of the matching `}`. */
  close: number
  entries: JsoncEntry[]
}

export interface FieldEntry {
  name: string
  text: string
  span: EntrySpan
}

export function readTopLevelObject(text: string): JsoncObject {
  const tokens = tokenize(text)
  return readObject(text, tokens, topLevelObject(tokens))
}

export function readTopLevelEntries(text: string): JsoncEntry[] {
  return readTopLevelObject(text).entries
}

/** The top-level `fields` object; none when the key is absent or not an object. */
export function readFieldsObject(text: string): JsoncObject | undefined {
  const tokens = tokenize(text)
  const fields = readMembers(text, tokens, topLevelObject(tokens)).find(
    (member) => member.key === 'fields',
  )
  const value = tokens[fields?.valueIndex ?? -1]
  if (
    fields === undefined ||
    value === undefined ||
    text.charAt(value.start) !== '{'
  ) {
    return undefined
  }
  return readObject(text, tokens, fields.valueIndex)
}

/** Entries of the top-level `fields` object; none when there is none. */
export function readFieldEntries(text: string): FieldEntry[] {
  return (readFieldsObject(text)?.entries ?? []).map((entry) => ({
    name: entry.key,
    text: entry.text,
    span: entry.span,
  }))
}

/**
 * Puts back the comma an entry lost when it was read. Before a trailing
 * `//` comment, because a comma after it would be commented out; that is
 * also where the entry had it (`"ignoreRelatives": [...], // deprecated`).
 */
export function withTrailingComma(entryText: string): string {
  const tokens = tokenize(entryText)
  const last = tokens[tokens.length - 1]
  const beforeLast = tokens[tokens.length - 2]
  if (
    last !== undefined &&
    beforeLast !== undefined &&
    isLineComment(entryText, last) &&
    !entryText.slice(beforeLast.end, last.start).includes('\n')
  ) {
    return `${entryText.slice(0, beforeLast.end)},${entryText.slice(beforeLast.end)}`
  }
  return `${entryText},`
}

type TokenKind =
  | 'open'
  | 'close'
  | 'colon'
  | 'comma'
  | 'string'
  | 'literal'
  | 'comment'

interface Token {
  kind: TokenKind
  start: number
  end: number
}

interface Member extends JsoncEntry {
  /** Token index where the value starts, so nested objects can be read. */
  valueIndex: number
}

function toEntry(member: Member): JsoncEntry {
  return { key: member.key, text: member.text, span: member.span }
}

function readObject(text: string, tokens: Token[], open: number): JsoncObject {
  const entries = readMembers(text, tokens, open).map(toEntry)
  const close = tokens[lastTokenOfValue(tokens, open)] as Token
  return { open: (tokens[open] as Token).start, close: close.start, entries }
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < text.length) {
    if (/\s/.test(text.charAt(i))) {
      i++
      continue
    }
    const token = tokenAt(text, i)
    tokens.push(token)
    i = token.end
  }
  return tokens
}

function tokenAt(text: string, start: number): Token {
  const char = text.charAt(start)
  const single = SINGLE_CHAR_TOKENS[char]
  if (single !== undefined) {
    return { kind: single, start, end: start + 1 }
  }
  if (char === '"') {
    return { kind: 'string', start, end: stringEnd(text, start) }
  }
  if (text.startsWith('//', start)) {
    return { kind: 'comment', start, end: lineEnd(text, start) }
  }
  if (text.startsWith('/*', start)) {
    return { kind: 'comment', start, end: blockCommentEnd(text, start) }
  }
  return { kind: 'literal', start, end: literalEnd(text, start) }
}

const SINGLE_CHAR_TOKENS: Record<string, TokenKind | undefined> = {
  '{': 'open',
  '[': 'open',
  '}': 'close',
  ']': 'close',
  ':': 'colon',
  ',': 'comma',
}

function stringEnd(text: string, start: number): number {
  let i = start + 1
  while (i < text.length) {
    const char = text.charAt(i)
    if (char === '\\') {
      i += 2
    } else if (char === '"') {
      return i + 1
    } else {
      i++
    }
  }
  throw new Error(`Unterminated string at offset ${start}`)
}

function lineEnd(text: string, start: number): number {
  const newline = text.indexOf('\n', start)
  return newline === -1 ? text.length : newline
}

function blockCommentEnd(text: string, start: number): number {
  const close = text.indexOf('*/', start + 2)
  if (close === -1) {
    throw new Error(`Unterminated comment at offset ${start}`)
  }
  return close + 2
}

function literalEnd(text: string, start: number): number {
  let i = start
  while (i < text.length && !/[\s{}[\]:,"/]/.test(text.charAt(i))) {
    i++
  }
  return i
}

function isLineComment(text: string, token: Token): boolean {
  return token.kind === 'comment' && text.startsWith('//', token.start)
}

function topLevelObject(tokens: Token[]): number {
  const index = tokens.findIndex((token) => token.kind !== 'comment')
  if (tokens[index]?.kind !== 'open') {
    throw new Error('Expected the file to be a JSON object')
  }
  return index
}

function readMembers(text: string, tokens: Token[], open: number): Member[] {
  const members: Member[] = []
  // Tokens before `floor` belong to the previous member, so its trailing
  // comments are never taken as leading comments of the next one.
  let floor = open + 1
  let i = floor
  for (;;) {
    i = skipComments(tokens, i)
    const token = expectToken(tokens, i, 'a key or the end of the object')
    if (token.kind === 'close') {
      return members
    }
    if (token.kind === 'comma') {
      i++
      continue
    }
    const member = readMember(text, tokens, floor, i)
    members.push(member.member)
    floor = i = member.next
  }
}

function readMember(
  text: string,
  tokens: Token[],
  floor: number,
  keyIndex: number,
): { member: Member; next: number } {
  const key = expectToken(tokens, keyIndex, 'a key')
  if (key.kind !== 'string') {
    throw new Error(`Expected a key at offset ${key.start}`)
  }
  const colonIndex = skipComments(tokens, keyIndex + 1)
  if (expectToken(tokens, colonIndex, 'a colon').kind !== 'colon') {
    throw new Error(`Expected a colon after the key at offset ${key.start}`)
  }
  const valueIndex = skipComments(tokens, colonIndex + 1)
  const valueLast = lastTokenOfValue(tokens, valueIndex)
  const valueEnd = (tokens[valueLast] as Token).end
  const trailing = readTrailing(text, tokens, valueLast + 1, valueEnd)
  const start = leadingCommentsStart(text, tokens, floor, keyIndex)
  const span: EntrySpan = {
    start,
    keyStart: key.start,
    valueEnd,
    end: trailing.end,
  }
  if (trailing.comma !== undefined) {
    span.comma = trailing.comma
  }
  return {
    member: {
      key: JSON.parse(text.slice(key.start, key.end)) as string,
      text: text.slice(start, valueEnd) + trailing.text,
      valueIndex,
      span,
    },
    next: trailing.next,
  }
}

function skipComments(tokens: Token[], index: number): number {
  let i = index
  while (tokens[i]?.kind === 'comment') {
    i++
  }
  return i
}

function expectToken(tokens: Token[], index: number, what: string): Token {
  const token = tokens[index]
  if (token === undefined) {
    throw new Error(`Unexpected end of text, expected ${what}`)
  }
  return token
}

function lastTokenOfValue(tokens: Token[], index: number): number {
  const first = expectToken(tokens, index, 'a value')
  if (first.kind === 'string' || first.kind === 'literal') {
    return index
  }
  if (first.kind !== 'open') {
    throw new Error(`Expected a value at offset ${first.start}`)
  }
  let depth = 0
  for (let i = index; i < tokens.length; i++) {
    const kind = tokens[i]?.kind
    if (kind === 'open') {
      depth++
    } else if (kind === 'close' && --depth === 0) {
      return i
    }
  }
  throw new Error(`Unterminated value at offset ${first.start}`)
}

/**
 * Comments on the value's line after it, and the separating comma, which is
 * consumed but left out of the text so the writer can place it.
 */
function readTrailing(
  text: string,
  tokens: Token[],
  index: number,
  valueEnd: number,
): { text: string; next: number; end: number; comma?: number } {
  let comma: Token | undefined
  let end = valueEnd
  let i = index
  for (; i < tokens.length; i++) {
    const token = tokens[i] as Token
    if (token.kind === 'comma' && comma === undefined) {
      comma = token
    } else if (
      token.kind === 'comment' &&
      !text.slice(valueEnd, token.start).includes('\n')
    ) {
      end = token.end
    } else {
      break
    }
  }
  const trailing =
    comma !== undefined && comma.start < end
      ? text.slice(valueEnd, comma.start) + text.slice(comma.end, end)
      : text.slice(valueEnd, end)
  return comma === undefined
    ? { text: trailing, next: i, end }
    : { text: trailing, next: i, end, comma: comma.start }
}

function leadingCommentsStart(
  text: string,
  tokens: Token[],
  floor: number,
  keyIndex: number,
): number {
  let first = keyIndex
  while (first - 1 >= floor) {
    const above = tokens[first - 1] as Token
    const below = tokens[first] as Token
    if (
      above.kind !== 'comment' ||
      hasBlankLine(text.slice(above.end, below.start))
    ) {
      break
    }
    first--
  }
  return (tokens[first] as Token).start
}

function hasBlankLine(whitespace: string): boolean {
  return (whitespace.match(/\n/g)?.length ?? 0) >= 2
}
