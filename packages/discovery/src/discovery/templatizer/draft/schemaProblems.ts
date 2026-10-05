/**
 * Every place a value breaks a `@l2beat/validate` schema, not only the first.
 *
 * The library stops at the first failure and reports it as, say,
 * `Strict violation, unexpected key found.`; in a repair round that costs a
 * round per mistake and never says which key would be right. Walking the
 * schema's definition instead reports each unexpected key (with the allowed
 * ones), each missing key and each wrong value at its own path, naming what
 * was expected. Leaves are still decided by the schema itself (`safeParse`),
 * so the walk accepts exactly what the schema accepts.
 */
import type { ImpDefinition, Parser } from '@l2beat/validate'
import { Reference } from '../../handlers/reference'
import { SingleSlot } from '../../handlers/storageCommon'
import { BytesFromString, NumberFromString } from '../../handlers/types'
import { StorageHandlerDefinition } from '../../handlers/user/StorageHandler'
import { closest, levenshtein } from '../closest'

export interface SchemaProblem {
  path: string
  message: string
}

interface Schema {
  definition?: ImpDefinition
  safeParse: Parser<unknown>['safeParse']
}

const SLOT =
  'a slot (a non-negative integer, a 0x hex string, a decimal string or a reference such as "{{ field }}")'

/** Descriptions of shared V1 validators whose check predicates cannot be read back. */
const KNOWN_SCHEMAS = new Map<unknown, string>([
  [Reference, 'a reference such as "{{ field }}"'],
  [NumberFromString, 'a decimal string such as "12"'],
  [BytesFromString, 'a 0x-prefixed hex string'],
  [SingleSlot, SLOT],
  [
    propertyOf(StorageHandlerDefinition, 'slot'),
    `${SLOT}, or a non-empty array of slots hashed into a mapping slot`,
  ],
])

export function schemaProblems(
  schema: Parser<unknown>,
  value: unknown,
  basePath: string,
): SchemaProblem[] {
  const problems: SchemaProblem[] = []
  walk(schema, value, basePath, problems)
  return problems
}

/** `base.key` for identifiers, `base["odd key"]` otherwise, as `fieldPath` spells field names. */
export function appendKey(base: string, key: string): string {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) {
    return `${base}[${JSON.stringify(key)}]`
  }
  return base === '' ? key : `${base}.${key}`
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function show(value: unknown): string {
  const json = JSON.stringify(value)
  if (json === undefined) {
    return 'nothing'
  }
  return json.length > 80 ? `${json.slice(0, 77)}...` : json
}

function propertyOf(schema: Schema, key: string): Schema | undefined {
  const definition = schema.definition
  return definition?.type === 'object' ? definition.schema[key] : undefined
}

function walk(
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  const definition = schema.definition
  switch (definition?.type) {
    case 'optional':
      if (value !== undefined) {
        walk(definition.parent, value, path, problems)
      }
      return
    case 'object':
      walkObject(definition, schema, value, path, problems)
      return
    case 'record':
      walkRecord(definition, schema, value, path, problems)
      return
    case 'array':
      walkArray(definition, schema, value, path, problems)
      return
    case 'union':
      walkUnion(definition, schema, value, path, problems)
      return
    default:
      checkLeaf(schema, value, path, problems)
  }
}

/**
 * A union that fails is walked into the one variant of the value's own
 * kind (an array for an array, an object for an object), so a wrong key
 * inside `add: [{ … }]` is reported at its key rather than as "expected an
 * object or an array".
 */
function walkUnion(
  definition: Extract<ImpDefinition, { type: 'union' }>,
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  if (parses(schema, value)) {
    return
  }
  const kind = Array.isArray(value)
    ? ['array']
    : isPlainObject(value)
      ? ['object', 'record']
      : []
  const variants = definition.values.filter((variant) =>
    kind.includes(variant.definition.type),
  )
  if (variants.length === 1) {
    walk(variants[0] as Schema, value, path, problems)
    return
  }
  checkLeaf(schema, value, path, problems)
}

function walkObject(
  definition: Extract<ImpDefinition, { type: 'object' }>,
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  if (!isPlainObject(value)) {
    checkLeaf(schema, value, path, problems)
    return
  }
  const allowed = Object.keys(definition.schema)
  if (definition.strict) {
    for (const key of Object.keys(value).filter((k) => !allowed.includes(k))) {
      problems.push({
        path: appendKey(path, key),
        message: unexpectedKey(key, allowed),
      })
    }
  }
  for (const key of allowed) {
    const child = definition.schema[key] as Schema
    const prop = value[key]
    if (prop === undefined && !parses(child, undefined)) {
      problems.push({
        path: appendKey(path, key),
        message: `missing; expected ${describe(child)}`,
      })
      continue
    }
    if (prop !== undefined) {
      walk(child, prop, appendKey(path, key), problems)
    }
  }
}

function walkRecord(
  definition: Extract<ImpDefinition, { type: 'record' }>,
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  if (!isPlainObject(value)) {
    checkLeaf(schema, value, path, problems)
    return
  }
  for (const [key, prop] of Object.entries(value)) {
    if (!parses(definition.key, key)) {
      problems.push({
        path: appendKey(path, key),
        message: `${JSON.stringify(key)} is not a valid key here; expected ${describe(definition.key)}`,
      })
      continue
    }
    walk(definition.value, prop, appendKey(path, key), problems)
  }
}

function walkArray(
  definition: Extract<ImpDefinition, { type: 'array' }>,
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  if (!Array.isArray(value)) {
    checkLeaf(schema, value, path, problems)
    return
  }
  value.forEach((element, i) =>
    walk(definition.element, element, `${path}[${i}]`, problems),
  )
}

function checkLeaf(
  schema: Schema,
  value: unknown,
  path: string,
  problems: SchemaProblem[],
): void {
  if (!parses(schema, value)) {
    problems.push({
      path,
      message: `expected ${describe(schema)}, got ${show(value)}`,
    })
  }
}

/**
 * `safeParse`, not `safeValidate`: V1's storage schema holds transforms,
 * which cannot validate. A schema that throws anyway counts as a failure.
 */
function parses(schema: Schema, value: unknown): boolean {
  try {
    return schema.safeParse(value).success
  } catch {
    return false
  }
}

function unexpectedKey(key: string, allowed: string[]): string {
  const [hint] = closest(allowed, key, 1)
  const guess =
    hint !== undefined && isNearMiss(key, hint)
      ? ` (did you mean "${hint}"?)`
      : ''
  return `unexpected key${guess}; allowed keys are ${allowed.join(', ')}`
}

/** A typo, not another word: two edits (one swap), or one per three characters. */
function isNearMiss(a: string, b: string): boolean {
  return (
    levenshtein(a.toLowerCase(), b.toLowerCase()) <=
    Math.max(2, Math.floor(Math.min(a.length, b.length) / 3))
  )
}

/** What a schema accepts, in words, for "expected …" messages. */
export function describe(schema: Schema): string {
  const known = KNOWN_SCHEMAS.get(schema)
  if (known !== undefined) {
    return known
  }
  const definition = schema.definition
  switch (definition?.type) {
    case 'string':
      return 'a string'
    case 'number':
      return 'a number'
    case 'boolean':
      return 'a boolean'
    case 'literal':
      return JSON.stringify(definition.value)
    case 'enum':
      return `one of ${definition.values.map((v) => JSON.stringify(v)).join(', ')}`
    case 'object':
    case 'record':
      return 'an object'
    case 'array':
      return `an array, each element ${describe(definition.element)}`
    case 'union':
      return [...new Set(definition.values.map(describe))].join(' or ')
    case 'optional':
    case 'default':
    case 'catch':
    case 'transform':
      return describe(definition.parent)
    case 'check':
      return describeCheck(definition.parent)
    default:
      return 'a valid value'
  }
}

/**
 * The checks inside the seven handler schemas are few and fixed: numbers
 * must be non-negative integers, arrays non-empty, and the string checks are
 * the shared validators in `KNOWN_SCHEMAS` plus the role-hash key.
 */
function describeCheck(parent: Schema): string {
  switch (parent.definition?.type) {
    case 'number':
      return 'a non-negative integer'
    case 'array':
      return `${describe(parent)}, at least one`
    case 'string':
      return 'a 0x-prefixed 32-byte hex string'
    default:
      return `a valid ${describe(parent)}`
  }
}
