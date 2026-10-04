/**
 * Adds to an existing `template.jsonc` without changing a byte of it.
 *
 * A template is shared by every contract whose code matches one of its
 * shapes, across projects, and its text is a researcher's work: comments,
 * key order, hand-made layout. So the new file is the old text with blocks
 * inserted, nothing else: new fields appended at the end of `fields`, and
 * `review:` comment lines placed directly above the field they concern.
 * Before anything is returned, the inserted blocks are removed again and
 * the result must equal the old text exactly; a difference is a bug here
 * and stops the run rather than reaching the repository.
 *
 * A note is written once: a rerun that finds the same line already
 * directly above the field (block numbers aside) does not repeat it.
 */
import {
  type JsoncEntry,
  type JsoncObject,
  readFieldsObject,
  readTopLevelObject,
} from './jsoncEntries'
import {
  assertLoadsAsTemplate,
  INDENT,
  joinMembers,
  lineComment,
  oneLine,
  renderFieldEntry,
  type TemplateFileField,
} from './templateFile'

export interface TemplateAdditions {
  /** One comment line above the first appended field, without `//`: who added them and when. */
  provenance?: string
  /** Comment lines per existing field, without `//`, placed directly above the field's key. */
  fieldNotes?: Record<string, string[]>
  /** Fields to append, in order. */
  fields?: TemplateFileField[]
}

/** A range of the new text that was inserted; removing every range gives the old text back. */
export interface Insertion {
  start: number
  end: number
}

export interface AppendResult {
  text: string
  /** Empty when there was nothing new to write. */
  insertions: Insertion[]
}

interface Edit {
  /** Offset in the old text to insert at. */
  at: number
  text: string
}

export function appendToTemplate(
  oldText: string,
  additions: TemplateAdditions,
): AppendResult {
  const document = readTopLevelObject(oldText)
  const fieldsObject = readFieldsObject(oldText)
  const existing = fieldsObject?.entries ?? []
  const fields = additions.fields ?? []
  assertFieldsKeyIsObject(document, fieldsObject)
  assertNewNames(existing, fields)
  const edits = [
    ...noteEdits(oldText, existing, additions.fieldNotes ?? {}),
    ...fieldEdits(oldText, document, fieldsObject, fields, additions),
  ]
  const result = applyEdits(oldText, edits)
  if (removeInsertions(result.text, result.insertions) !== oldText) {
    throw new Error(
      'appendToTemplate would change the existing text of the template; nothing was written',
    )
  }
  if (result.insertions.length > 0) {
    assertLoadsAsTemplate(result.text)
  }
  return result
}

/** The text with every inserted range cut out, for the invariant and for tests. */
export function removeInsertions(
  text: string,
  insertions: readonly Insertion[],
): string {
  const sorted = [...insertions].sort((a, b) => a.start - b.start)
  let kept = ''
  let cursor = 0
  for (const { start, end } of sorted) {
    kept += text.slice(cursor, start)
    cursor = end
  }
  return kept + text.slice(cursor)
}

function assertFieldsKeyIsObject(
  document: JsoncObject,
  fieldsObject: JsoncObject | undefined,
): void {
  const key = document.entries.find((entry) => entry.key === 'fields')
  if (key !== undefined && fieldsObject === undefined) {
    throw new Error('the template has a "fields" key that is not an object')
  }
}

function assertNewNames(
  existing: readonly JsoncEntry[],
  fields: readonly TemplateFileField[],
): void {
  const taken = new Set(existing.map((entry) => entry.key))
  const repeated = fields
    .map((field) => field.name)
    .filter((name, i, names) => taken.has(name) || names.indexOf(name) !== i)
  if (repeated.length > 0) {
    throw new Error(
      `cannot append ${repeated.map((name) => JSON.stringify(name)).join(', ')}: the template already has a field of that name`,
    )
  }
}

/**
 * A note goes directly above the field's key line, under the researcher's
 * own comments, with the key line's indentation. Lines already there are
 * not repeated.
 */
function noteEdits(
  oldText: string,
  existing: readonly JsoncEntry[],
  fieldNotes: Record<string, string[]>,
): Edit[] {
  const edits: Edit[] = []
  for (const [name, notes] of Object.entries(fieldNotes)) {
    const entry = existing.find((field) => field.key === name)
    if (entry === undefined) {
      throw new Error(`cannot note "${name}": the template has no such field`)
    }
    const lineStart = startOfLine(oldText, entry.span.keyStart)
    const indent = leadingWhitespace(
      oldText.slice(lineStart, entry.span.keyStart),
    )
    const present = commentLinesAbove(oldText, lineStart)
    const fresh = notes
      .map(lineComment)
      .filter((line) => !present.some((above) => sameNote(above, line)))
    if (fresh.length > 0) {
      edits.push({
        at: lineStart,
        text: fresh.map((line) => `${indent}${line}\n`).join(''),
      })
    }
  }
  return edits
}

function fieldEdits(
  oldText: string,
  document: JsoncObject,
  fieldsObject: JsoncObject | undefined,
  fields: readonly TemplateFileField[],
  additions: TemplateAdditions,
): Edit[] {
  if (fields.length === 0) {
    return []
  }
  const memberIndent = indentOfMembers(oldText, document) ?? INDENT
  const fieldIndent =
    (fieldsObject && indentOfMembers(oldText, fieldsObject)) ??
    memberIndent + INDENT
  const block = renderBlock(fields, additions.provenance, fieldIndent)
  if (fieldsObject === undefined) {
    const member = `"fields": {\n${block}\n${memberIndent}}`
    return appendMember(oldText, document, member, memberIndent)
  }
  return appendMember(oldText, fieldsObject, block, fieldIndent, true)
}

/** The provenance line, then the fields with commas between them, every line indented. */
function renderBlock(
  fields: readonly TemplateFileField[],
  provenance: string | undefined,
  indent: string,
): string {
  const members = joinMembers(
    fields.map((field) => renderFieldEntry(field, indent)),
    indent,
  )
  const header =
    provenance === undefined ? [] : [`${indent}${lineComment(provenance)}`]
  return [...header, ...members].join('\n')
}

/**
 * Inserts `member` as the last member of `object`: after the last entry
 * (with a comma between, placed before that entry's same-line comment when
 * it has one), or between the braces of an empty object. `rendered` says
 * the member already carries its indentation on every line.
 */
function appendMember(
  oldText: string,
  object: JsoncObject,
  member: string,
  indent: string,
  rendered = false,
): Edit[] {
  const text = rendered ? member : `${indent}${member}`
  const last = object.entries.at(-1)
  if (last === undefined) {
    const closeIndent = leadingWhitespace(
      oldText.slice(startOfLine(oldText, object.close), object.close),
    )
    return [{ at: object.close, text: `\n${text}\n${closeIndent}` }]
  }
  if (last.span.comma !== undefined) {
    const at = Math.max(last.span.end, last.span.comma + 1)
    return [{ at, text: `\n${text}` }]
  }
  return [
    { at: last.span.valueEnd, text: ',' },
    { at: last.span.end, text: `\n${text}` },
  ]
}

/** The indentation of the object's first member when its key starts a line. */
function indentOfMembers(
  oldText: string,
  object: JsoncObject,
): string | undefined {
  const first = object.entries[0]
  if (first === undefined) {
    return undefined
  }
  const lineStart = startOfLine(oldText, first.span.keyStart)
  const before = oldText.slice(lineStart, first.span.keyStart)
  return /^\s*$/.test(before) ? before : undefined
}

/** Applies edits in order; returns the new text and where each edit landed in it. */
function applyEdits(oldText: string, edits: readonly Edit[]): AppendResult {
  const sorted = [...edits].sort((a, b) => a.at - b.at)
  let text = ''
  let cursor = 0
  const insertions: Insertion[] = []
  for (const edit of sorted) {
    text += oldText.slice(cursor, edit.at)
    insertions.push({ start: text.length, end: text.length + edit.text.length })
    text += edit.text
    cursor = edit.at
  }
  return { text: text + oldText.slice(cursor), insertions }
}

function startOfLine(text: string, offset: number): number {
  return text.lastIndexOf('\n', offset - 1) + 1
}

function leadingWhitespace(text: string): string {
  return /^[ \t]*/.exec(text)?.[0] ?? ''
}

/** The `//` comment lines directly above `lineStart`, nearest last, trimmed. */
function commentLinesAbove(text: string, lineStart: number): string[] {
  const lines: string[] = []
  let end = lineStart
  while (end > 0) {
    const start = startOfLine(text, end - 1)
    const line = text.slice(start, end - 1).trim()
    if (!line.startsWith('//')) {
      break
    }
    lines.push(line)
    end = start
  }
  return lines
}

/** The same note up to the block it was observed at. */
function sameNote(a: string, b: string): boolean {
  const mask = (line: string) => oneLine(line).replace(/block \d+/g, 'block N')
  return mask(a) === mask(b)
}
