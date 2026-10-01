/**
 * The `template.jsonc` text an accepted draft becomes.
 *
 * The file is what a researcher would have written, plus the model's
 * reason above each field and a provenance header, because researchers
 * review it as a git diff and edit it by hand afterwards. `formatJson`
 * cannot emit comments, hence this small serializer.
 *
 * Layout is what biome prints for committed templates, so `biome format`
 * (which runs over `_templates` in CI) leaves the file as written: the
 * document, `fields`, each field and each `handler` object are expanded one
 * key per line (biome keeps an expanded object expanded, and 9 in 10
 * committed handlers are written that way); every other value goes on one
 * line when that line, indentation, key and comma included, fits in 80
 * columns, and is otherwise expanded one member per line, recursively, with
 * arrays of numbers packed as many per line as fit.
 */
import { getErrorMessage, parseJsonc } from '@l2beat/shared-pure'
import { ColorContract } from '../../config/ColorConfig'
import { ContractPermission } from '../../config/PermissionConfig'
import { StructureContract } from '../../config/StructureConfig'
import { withTrailingComma } from './jsoncEntries'

export interface TemplateFileInput {
  /** Relative path to the schema, see `schemaPathFor`. */
  schema: string
  /** The provenance line, without `//`. */
  header: string
  /** Freeze path: top-level entries of the old file, verbatim, in its order. */
  preserved?: { key: string; text: string }[]
  displayName?: string
  ignoreMethods: string[]
  /** Freeze path: whole field entries of the old file, verbatim. */
  lockedFields?: { name: string; text: string }[]
  /** The model's fields, in the model's order. */
  fields: TemplateFileField[]
}

export interface TemplateFileField {
  name: string
  reason: string
  covers: string[]
  handler: unknown
  edit?: unknown
}

/**
 * The relative `$schema` of a template, the same formula as
 * `TemplateService.ensureTemplateExists`, so an authored template is
 * indistinguishable from one created there.
 */
export function schemaPathFor(templateId: string): string {
  const depth = templateId.split('/').length - 1
  return `../../../../../${'../'.repeat(depth)}discovery/schemas/contract.v2.schema.json`
}

/** Throws when the result would not load as a template; nothing is written. */
export function renderTemplateFile(input: TemplateFileInput): string {
  assertUnique('top-level key', topLevelKeys(input))
  assertUnique('field name', fieldNames(input))
  const text = renderDocument(input)
  assertLoadsAsTemplate(text)
  return text
}

const WIDTH = 80
const INDENT = '  '
const FIELD_INDENT = INDENT.repeat(2)

/**
 * The header stands apart from the next key by a blank line, so that
 * reading the file back (`readTopLevelEntries`) does not attach it to that
 * key and a later freeze does not copy an old header along.
 */
function renderDocument(input: TemplateFileInput): string {
  const [schema, ...rest] = joinMembers(topLevelMembers(input), INDENT)
  const lines = [schema, `${INDENT}${lineComment(input.header)}`]
  if (rest.length > 0) {
    lines.push('', ...rest)
  }
  return `{\n${lines.join('\n')}\n}\n`
}

function topLevelMembers(input: TemplateFileInput): string[] {
  const preserved = (input.preserved ?? []).map((entry) => entry.text)
  const fields = fieldsMember(input)
  const ignoreMethodsIsLast = preserved.length === 0 && fields.length === 0
  return [
    `"$schema": ${JSON.stringify(input.schema)}`,
    ...(input.displayName !== undefined
      ? [`"displayName": ${JSON.stringify(input.displayName)}`]
      : []),
    ...ignoreMethodsMember(input.ignoreMethods, ignoreMethodsIsLast),
    ...preserved,
    ...fields,
  ]
}

function ignoreMethodsMember(names: string[], isLast: boolean): string[] {
  if (names.length === 0) {
    return []
  }
  return [renderMember('ignoreMethods', names, INDENT, isLast)]
}

function fieldsMember(input: TemplateFileInput): string[] {
  const members = [
    ...(input.lockedFields ?? []).map((field) => field.text),
    ...input.fields.map(renderField),
  ]
  if (members.length === 0) {
    return []
  }
  const body = joinMembers(members, FIELD_INDENT).join('\n')
  return [`"fields": {\n${body}\n${INDENT}}`]
}

function renderField(field: TemplateFileField): string {
  const inner = FIELD_INDENT + INDENT
  const handler = `"handler": ${renderExpanded(toJson(field.handler), inner)}`
  const edit =
    field.edit === undefined
      ? []
      : [renderMember('edit', toJson(field.edit), inner, true)]
  const body = joinMembers([handler, ...edit], inner).join('\n')
  return [
    ...fieldComments(field),
    `${JSON.stringify(field.name)}: {\n${body}\n${FIELD_INDENT}}`,
  ].join(`\n${FIELD_INDENT}`)
}

function fieldComments(field: TemplateFileField): string[] {
  const comments: string[] = []
  if (oneLine(field.reason) !== '') {
    comments.push(lineComment(field.reason))
  }
  if (field.covers.length > 0) {
    comments.push(lineComment(`covers: ${field.covers.join(', ')}`))
  }
  return comments
}

/**
 * Line comments end only at a line break, so collapsing whitespace is all
 * it takes to keep model text from escaping the comment; `*\/` has no
 * meaning inside one.
 */
function lineComment(text: string): string {
  return `// ${oneLine(text)}`
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Members of one object, each with the indentation of its first line and
 * a comma after all but the last. Continuation lines already carry theirs:
 * verbatim entries from their old file, rendered ones from `renderValue`.
 */
function joinMembers(members: string[], indent: string): string[] {
  return members.map(
    (member, i) =>
      indent + (i < members.length - 1 ? withTrailingComma(member) : member),
  )
}

function renderMember(
  key: string,
  value: unknown,
  indent: string,
  isLast: boolean,
): string {
  const prefix = `${JSON.stringify(key)}: `
  const used = indent.length + prefix.length
  return prefix + renderValue(value, indent, used, isLast ? 0 : 1)
}

/** An object expanded one key per line whether it fits or not. */
function renderExpanded(value: unknown, indent: string): string {
  if (!isNonEmptyObject(value)) {
    return renderValue(value, indent, indent.length, 1)
  }
  const inner = indent + INDENT
  const entries = Object.entries(value)
  const members = entries.map(([key, child], i) =>
    renderMember(key, child, inner, i === entries.length - 1),
  )
  return `{\n${joinMembers(members, inner).join('\n')}\n${indent}}`
}

/**
 * `value` rendered where `used` columns of the line are taken and `suffix`
 * characters (a comma) follow it; lines after the first are indented
 * absolutely, starting from `indent`.
 */
function renderValue(
  value: unknown,
  indent: string,
  used: number,
  suffix: number,
): string {
  const flat = renderFlat(value)
  if (used + flat.length + suffix <= WIDTH || !isNonEmptyContainer(value)) {
    return flat
  }
  const inner = indent + INDENT
  if (Array.isArray(value)) {
    return isNumberArray(value)
      ? `[\n${packNumbers(value, inner).join('\n')}\n${indent}]`
      : `[\n${renderItems(value, inner).join(',\n')}\n${indent}]`
  }
  const entries = Object.entries(value as Record<string, unknown>)
  const members = entries.map(([key, child], i) =>
    renderMember(key, child, inner, i === entries.length - 1),
  )
  return `{\n${members.map((member) => inner + member).join(',\n')}\n${indent}}`
}

function renderItems(items: unknown[], indent: string): string[] {
  return items.map(
    (item, i) =>
      indent +
      renderValue(item, indent, indent.length, i < items.length - 1 ? 1 : 0),
  )
}

/** Biome's layout for arrays of numbers: as many per line as fit. */
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
  if (isNonEmptyObject(value)) {
    const members = Object.entries(value).map(
      ([key, child]) => `${JSON.stringify(key)}: ${renderFlat(child)}`,
    )
    return `{ ${members.join(', ')} }`
  }
  return JSON.stringify(value)
}

/**
 * What `JSON.stringify` would keep of a value (no `undefined` members, no
 * class instances), so the layout above only meets plain JSON.
 */
function toJson(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value) ?? 'null')
}

function isNonEmptyContainer(value: unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : isNonEmptyObject(value)
}

function isNonEmptyObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  )
}

function isNumberArray(value: unknown[]): value is number[] {
  return value.length > 1 && value.every((item) => typeof item === 'number')
}

function topLevelKeys(input: TemplateFileInput): string[] {
  const hasFields =
    (input.lockedFields ?? []).length > 0 || input.fields.length > 0
  return [
    '$schema',
    ...(input.displayName !== undefined ? ['displayName'] : []),
    ...(input.ignoreMethods.length > 0 ? ['ignoreMethods'] : []),
    ...(input.preserved ?? []).map((entry) => entry.key),
    ...(hasFields ? ['fields'] : []),
  ]
}

function fieldNames(input: TemplateFileInput): string[] {
  return [
    ...(input.lockedFields ?? []).map((field) => field.name),
    ...input.fields.map((field) => field.name),
  ]
}

/** A repeated key parses silently with the last value winning, so refuse it. */
function assertUnique(what: string, names: string[]): void {
  const repeated = names.filter((name, i) => names.indexOf(name) !== i)
  if (repeated.length > 0) {
    throw new Error(
      `template.jsonc would repeat the ${what} ${[...new Set(repeated)].map((name) => JSON.stringify(name)).join(', ')}`,
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
      `Rendered template.jsonc does not load: ${getErrorMessage(error)}`,
    )
  }
}
