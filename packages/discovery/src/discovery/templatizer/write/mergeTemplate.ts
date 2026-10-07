/**
 * The one writer of `template.jsonc`: the model's partial template inserted
 * into a template's text, at paths the text does not have yet.
 *
 * A template is shared by every contract whose code matches one of its
 * shapes, across projects, and its text is a researcher's work: comments,
 * key order, layout. So the writer only inserts, never replaces. Where to
 * insert is read off the text with `jsonc-parser`. What is inserted is laid
 * out as biome formats committed templates, because CI runs `biome format`
 * over `_templates`: `fields`, each field and each handler one key per
 * line, and every other value on one line when it fits in 80 columns,
 * expanded otherwise. Every edit inserts text at an offset; the one other
 * edit is to whitespace, when an object written on one line gets a member
 * and is spread one member per line, as biome would print it. So the old
 * text survives byte for byte outside its whitespace; and before anything
 * is returned, every value the old text held must hold the same in the new
 * one, which a key inserted twice would break.
 *
 * What may be added depends on whether the template is new. An existing
 * template gets new entries under `fields`, and on a field it already has
 * only `severity`, `description` and `permissions`, which describe a value
 * without changing it; nothing at the top level, because an `ignoreMethods`
 * or `ignoreRelatives` added to a shared template changes what every
 * project using it reports. A new template is the same merge into the file
 * `TemplateService.ensureTemplateExists` creates, which holds only its
 * `$schema`, and anything may be added there. A path that exists is a
 * problem for the model to fix, never a replacement.
 */
import { getErrorMessage, parseJsonc } from '@l2beat/shared-pure'
import { type Node, parseTree } from 'jsonc-parser'
import { ColorContract } from '../../config/ColorConfig'
import { ContractPermission } from '../../config/PermissionConfig'
import { StructureContract } from '../../config/StructureConfig'
import { type Finding, fieldPath, joinPath } from '../draft/Finding'

/** What a field an existing template already has may be given. */
export const KEYS_ADDED_TO_EXISTING_FIELDS: readonly string[] = [
  'severity',
  'description',
  'permissions',
]

export interface MergeInput {
  /** The template's text; for a new template, the file `ensureTemplateExists` wrote. */
  text: string
  isNew: boolean
  /** The partial template to insert. */
  additions: Record<string, unknown>
  /** Comment lines, without `//`, above what is inserted for each field. */
  fieldComments?: Record<string, string[]>
  /** Comment lines, without `//`, above the first insertion: who added it and when. */
  header?: string[]
}

export type MergeResult = { text: string } | { problems: Finding[] }

const WIDTH = 80
const INDENT = '  '

/** Members inserted at the end of one object of the old text. */
interface Insertion {
  container: Node
  /** The container's path from the document, e.g. `["fields", "owner"]`. */
  path: string[]
  members: [key: string, value: unknown][]
}

export function mergeTemplate(input: MergeInput): MergeResult {
  const root = parseTree(input.text)
  if (root?.type !== 'object') {
    throw new Error('template.jsonc is not a JSON object')
  }
  const problems: Finding[] = []
  const insertions = planInsertions(root, input, problems)
  if (problems.length > 0) {
    return { problems }
  }
  if (insertions.length === 0) {
    if (!input.isNew) {
      return { text: input.text }
    }
    // A new template with nothing to add still gets its header.
    insertions.push({ container: root, path: [], members: [] })
  }
  insertions.sort(
    (a, b) =>
      insertionOffset(input.text, a.container) -
      insertionOffset(input.text, b.container),
  )
  const pieces = insertions.flatMap((insertion, i) =>
    piecesOf(input.text, insertion, {
      header: i === 0 ? (input.header ?? []) : [],
      fieldComments: input.fieldComments ?? {},
    }),
  )
  const text = apply(input.text, pieces)
  assertKeepsValues(parseJsonc(input.text), parseJsonc(text), '')
  assertLoadsAsTemplate(text)
  return { text }
}

function planInsertions(
  root: Node,
  input: MergeInput,
  problems: Finding[],
): Insertion[] {
  const insertions: Insertion[] = []
  const topLevel: Insertion = { container: root, path: [], members: [] }
  for (const [key, value] of Object.entries(input.additions)) {
    const existing = propertyOf(root, key)
    if (isRecord(value) && Object.keys(value).length === 0) {
      // `"fields": {}`, a reply with nothing to add, adds nothing.
      continue
    }
    if (key === 'fields' && existing !== undefined && isRecord(value)) {
      planFields(existing, value, insertions, problems)
    } else if (existing !== undefined) {
      problems.push({
        path: key,
        message: `the template already has ${key}, which keeps its value; leave ${key} out`,
      })
    } else if (!input.isNew && key !== 'fields') {
      problems.push({
        path: key,
        message: `this template is shared by every contract of its shapes, so nothing is added at its top level: add new entries under \`fields\`, and to a field it already has only ${KEYS_ADDED_TO_EXISTING_FIELDS.join(', ')}`,
      })
    } else {
      topLevel.members.push([key, value])
    }
  }
  if (topLevel.members.length > 0) {
    insertions.push(topLevel)
  }
  return insertions
}

function planFields(
  fieldsNode: Node,
  fields: Record<string, unknown>,
  insertions: Insertion[],
  problems: Finding[],
): void {
  const added: Insertion = {
    container: fieldsNode,
    path: ['fields'],
    members: [],
  }
  for (const [name, entry] of Object.entries(fields)) {
    const field = propertyOf(fieldsNode, name)
    if (field === undefined) {
      added.members.push([name, entry])
    } else if (field.type !== 'object' || !isRecord(entry)) {
      problems.push({
        path: fieldPath(name),
        message: `the template has a field ${name} already; pick another name`,
      })
    } else {
      planExistingField(name, field, entry, insertions, problems)
    }
  }
  if (added.members.length > 0) {
    insertions.push(added)
  }
}

function planExistingField(
  name: string,
  field: Node,
  entry: Record<string, unknown>,
  insertions: Insertion[],
  problems: Finding[],
): void {
  const insertion: Insertion = {
    container: field,
    path: ['fields', name],
    members: [],
  }
  for (const [key, value] of Object.entries(entry)) {
    const path = joinPath(fieldPath(name), key)
    if (propertyOf(field, key) !== undefined) {
      problems.push({
        path,
        message: `${name} already has ${key}, which keeps its value; leave ${key} out`,
      })
    } else if (!KEYS_ADDED_TO_EXISTING_FIELDS.includes(key)) {
      problems.push({
        path,
        message: `${name} is a field the template already has, and only ${KEYS_ADDED_TO_EXISTING_FIELDS.join(', ')} are added to it, which leave its value as it is; to read more state, add a field of another name`,
      })
    } else {
      insertion.members.push([key, value])
    }
  }
  if (insertion.members.length > 0) {
    insertions.push(insertion)
  }
}

/** `length` characters of the old text at `at`, all whitespace, replaced by `text`. */
interface Piece {
  at: number
  length: number
  text: string
}

/**
 * After the container's last member, past a comma when there is one and
 * past comments on the member's own line, which are about that member; or
 * right inside the braces.
 */
function insertionOffset(text: string, container: Node): number {
  const last = container.children?.at(-1)
  if (last === undefined) {
    return container.offset + 1
  }
  const end = last.offset + last.length
  const comma = commaAfter(text, end)
  const after = comma === undefined ? end : comma + 1
  const sameLine = /^(?:[ \t]*(?:\/\/[^\n]*|\/\*[^\n]*?\*\/))*/.exec(
    text.slice(after),
  )
  return after + (sameLine?.[0].length ?? 0)
}

/**
 * The members rendered at the end of the container, the header above the
 * first of them, and a comma right behind the last member unless it has
 * one. A container written on one line is spread one member per line around
 * them; so is an empty one, unless comments fill it, which stay above.
 */
function piecesOf(
  text: string,
  insertion: Insertion,
  context: { header: string[]; fieldComments: Record<string, string[]> },
): Piece[] {
  const { container, path, members } = insertion
  const children = container.children ?? []
  const close = container.offset + container.length - 1
  const oneLine = !text.slice(container.offset, close).includes('\n')
  const outer = lineIndent(text, container.offset)
  const last = children.at(-1)
  const indent =
    oneLine || last === undefined
      ? outer + INDENT
      : lineIndent(text, last.offset)
  const rendered = members.map(([key, value], i) => {
    const comments =
      path.length === 2 && i === 0
        ? (context.fieldComments[path[1] as string] ?? [])
        : commentsAt([...path, key], context.fieldComments)
    return renderMember(
      key,
      value,
      [...path, key],
      indent,
      i === members.length - 1,
      {
        comments: i === 0 ? [...context.header, ...comments] : comments,
        fieldComments: context.fieldComments,
      },
    )
  })
  const at = insertionOffset(text, container)
  const end = last === undefined ? undefined : last.offset + last.length
  const afterComma = end !== undefined && commaAfter(text, end) !== undefined
  const body =
    rendered.length === 0
      ? context.header.map((line) => `\n${indent}${lineComment(line)}`).join('')
      : afterComma
        ? `${rendered.join(',')},`
        : rendered.join(',')
  const pieces: Piece[] = []
  if (oneLine) {
    for (const child of children) {
      pieces.push(whitespaceBefore(text, child.offset, `\n${indent}`))
    }
  }
  if (end !== undefined && !afterComma && rendered.length > 0) {
    pieces.push({ at: end, length: 0, text: ',' })
  }
  const closing =
    (last === undefined || oneLine) && text.slice(at, close).trim() === ''
      ? `\n${outer}`
      : ''
  pieces.push({
    at,
    length: closing === '' ? 0 : close - at,
    text: body + closing,
  })
  return pieces
}

/** The whitespace right before `offset`, replaced by `text`. */
function whitespaceBefore(text: string, offset: number, by: string): Piece {
  const start = offset - (/\s*$/.exec(text.slice(0, offset))?.[0].length ?? 0)
  return { at: start, length: offset - start, text: by }
}

/** Comments for a field entry inserted inside a new `fields`. */
function commentsAt(
  path: string[],
  fieldComments: Record<string, string[]>,
): string[] {
  return path.length === 2 && path[0] === 'fields'
    ? (fieldComments[path[1] as string] ?? [])
    : []
}

interface Comments {
  comments: string[]
  fieldComments: Record<string, string[]>
}

/** `\n<indent>// comment` lines, then `\n<indent>"key": value`. */
function renderMember(
  key: string,
  value: unknown,
  path: string[],
  indent: string,
  isLast: boolean,
  { comments, fieldComments }: Comments,
): string {
  const above = comments
    .map((line) => `\n${indent}${lineComment(line)}`)
    .join('')
  const prefix = `${JSON.stringify(key)}: `
  const rendered = renderValue(value, path, {
    indent,
    used: indent.length + prefix.length,
    suffix: isLast ? 0 : 1,
    fieldComments,
  })
  return `${above}\n${indent}${prefix}${rendered}`
}

interface Layout {
  indent: string
  /** Columns of the line already taken. */
  used: number
  /** Characters that follow the value on its line: a comma. */
  suffix: number
  fieldComments: Record<string, string[]>
}

function renderValue(value: unknown, path: string[], layout: Layout): string {
  const flat = renderFlat(value)
  const fits = layout.used + flat.length + layout.suffix <= WIDTH
  if (isRecord(value) && Object.keys(value).length > 0) {
    return fits && !isExpanded(path) ? flat : renderObject(value, path, layout)
  }
  if (Array.isArray(value) && value.length > 0 && !fits) {
    return renderArray(value, path, layout)
  }
  return flat
}

/** `fields`, each field and each handler stay one key per line, as committed templates have them. */
function isExpanded(path: string[]): boolean {
  return (
    path[0] === 'fields' &&
    (path.length <= 2 || (path.length === 3 && path[2] === 'handler'))
  )
}

function renderObject(
  value: Record<string, unknown>,
  path: string[],
  layout: Layout,
): string {
  const inner = layout.indent + INDENT
  const entries = Object.entries(value)
  const members = entries.map(([key, child], i) =>
    renderMember(key, child, [...path, key], inner, i === entries.length - 1, {
      comments: commentsAt([...path, key], layout.fieldComments),
      fieldComments: layout.fieldComments,
    }),
  )
  return `{${members.join(',')}\n${layout.indent}}`
}

/** Biome's layout: one element per line, except numbers, packed as many per line as fit. */
function renderArray(value: unknown[], path: string[], layout: Layout): string {
  const inner = layout.indent + INDENT
  if (value.length > 1 && value.every((item) => typeof item === 'number')) {
    return `[\n${packNumbers(value as number[], inner).join('\n')}\n${layout.indent}]`
  }
  const items = value.map((item, i) => {
    const isLast = i === value.length - 1
    const rendered = renderValue(item, [...path, String(i)], {
      ...layout,
      indent: inner,
      used: inner.length,
      suffix: isLast ? 0 : 1,
    })
    return `${inner}${rendered}${isLast ? '' : ','}`
  })
  return `[\n${items.join('\n')}\n${layout.indent}]`
}

function packNumbers(numbers: number[], indent: string): string[] {
  const lines: string[] = []
  let line = ''
  numbers.forEach((number, i) => {
    const item = `${JSON.stringify(number)}${i < numbers.length - 1 ? ',' : ''}`
    if (line === '') {
      line = item
    } else if (indent.length + line.length + 1 + item.length <= WIDTH) {
      line += ` ${item}`
    } else {
      lines.push(indent + line)
      line = item
    }
  })
  lines.push(indent + line)
  return lines
}

function renderFlat(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(renderFlat).join(', ')}]`
  }
  if (isRecord(value) && Object.keys(value).length > 0) {
    const members = Object.entries(value).map(
      ([key, child]) => `${JSON.stringify(key)}: ${renderFlat(child)}`,
    )
    return `{ ${members.join(', ')} }`
  }
  return JSON.stringify(value) ?? 'null'
}

/**
 * Line comments end only at a line break, so collapsing whitespace is all
 * it takes to keep model text from escaping the comment.
 */
export function lineComment(text: string): string {
  return `// ${text.replace(/\s+/g, ' ').trim()}`
}

function lineIndent(text: string, offset: number): string {
  const start = text.lastIndexOf('\n', offset - 1) + 1
  return /^[ \t]*/.exec(text.slice(start, offset))?.[0] ?? ''
}

/** The offset of a comma after `offset`, past whitespace and comments only. */
function commaAfter(text: string, offset: number): number | undefined {
  const skipped = /^(?:\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/.exec(
    text.slice(offset),
  )
  const at = offset + (skipped?.[0].length ?? 0)
  return text[at] === ',' ? at : undefined
}

function propertyOf(object: Node, key: string): Node | undefined {
  return object.children?.find((child) => child.children?.[0]?.value === key)
    ?.children?.[1]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function apply(oldText: string, pieces: Piece[]): string {
  let text = ''
  let from = 0
  for (const piece of [...pieces].sort((a, b) => a.at - b.at)) {
    const replaced = oldText.slice(piece.at, piece.at + piece.length)
    if (piece.at < from || replaced.trim() !== '') {
      throw new Error(
        'mergeTemplate would change the existing text of the template; nothing was written',
      )
    }
    text += oldText.slice(from, piece.at) + piece.text
    from = piece.at + piece.length
  }
  return text + oldText.slice(from)
}

function assertKeepsValues(old: unknown, merged: unknown, path: string): void {
  if (isRecord(old) && isRecord(merged)) {
    for (const [key, value] of Object.entries(old)) {
      assertKeepsValues(value, merged[key], joinPath(path, key))
    }
    return
  }
  if (JSON.stringify(old) !== JSON.stringify(merged)) {
    throw new Error(
      `mergeTemplate would change ${path || 'the template'}; nothing was written`,
    )
  }
}

/** The three schemas `TemplateService` reads a template with. */
function assertLoadsAsTemplate(text: string): void {
  try {
    const json = parseJsonc<unknown>(text)
    StructureContract.parse(json)
    ColorContract.parse(json)
    ContractPermission.parse(json)
  } catch (error) {
    throw new Error(
      `The merged template.jsonc does not load: ${getErrorMessage(error)}`,
    )
  }
}
