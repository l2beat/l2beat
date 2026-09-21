/**
 * A deliberately small JSON Schema subset for recipe arguments.
 *
 * Recipe argument schemas serve two audiences: the validator, which rejects a
 * plan whose arguments do not fit, and the model prompt, which is rendered
 * from the same schema. Both need the schema to be fully understood, so
 * `parseSchema` rejects any keyword outside the subset instead of silently
 * ignoring a typo like `minItem`. Error messages carry a JSON path and the
 * expectation because they are fed back to the model as repair findings.
 */
export type SchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'

export interface Schema {
  description?: string
  type?: SchemaType | SchemaType[]
  const?: unknown
  enum?: unknown[]
  properties?: Record<string, Schema>
  required?: string[]
  additionalProperties?: boolean | Schema
  propertyNames?: Schema
  items?: Schema
  minItems?: number
  minimum?: number
  pattern?: string
  oneOf?: Schema[]
  anyOf?: Schema[]
}

const SCHEMA_TYPES: readonly SchemaType[] = [
  'string',
  'number',
  'integer',
  'boolean',
  'object',
  'array',
  'null',
]

const KEYWORDS: ReadonlySet<keyof Schema> = new Set<keyof Schema>([
  'description',
  'type',
  'const',
  'enum',
  'properties',
  'required',
  'additionalProperties',
  'propertyNames',
  'items',
  'minItems',
  'minimum',
  'pattern',
  'oneOf',
  'anyOf',
])

export function parseSchema(value: unknown, path = 'schema'): Schema {
  if (!isPlainObject(value)) {
    throw new Error(`${path}: a schema must be an object`)
  }
  for (const keyword of Object.keys(value)) {
    if (!KEYWORDS.has(keyword as keyof Schema)) {
      throw new Error(
        `${path}: unsupported keyword "${keyword}" (supported: ${[...KEYWORDS].join(', ')})`,
      )
    }
  }
  const schema = value as Schema
  checkOptional(schema, 'description', path, isString, 'a string')
  checkOptional(schema, 'type', path, isSchemaType, 'a known type or list')
  checkOptional(schema, 'enum', path, isNonEmptyArray, 'a non-empty array')
  checkOptional(schema, 'minItems', path, isNonNegativeInteger, 'an integer')
  checkOptional(schema, 'minimum', path, isNumber, 'a number')
  checkOptional(schema, 'required', path, isStringArray, 'an array of names')
  checkOptional(schema, 'pattern', path, isString, 'a string')
  if (schema.pattern !== undefined) {
    compilePattern(schema.pattern, path)
  }
  if (schema.properties !== undefined) {
    if (!isPlainObject(schema.properties)) {
      throw new Error(`${path}.properties: must be an object`)
    }
    for (const [name, property] of Object.entries(schema.properties)) {
      parseSchema(property, `${path}.properties.${name}`)
    }
  }
  for (const name of schema.required ?? []) {
    if (schema.properties?.[name] === undefined) {
      throw new Error(
        `${path}.required: "${name}" is not declared in properties`,
      )
    }
  }
  if (
    schema.additionalProperties !== undefined &&
    typeof schema.additionalProperties !== 'boolean'
  ) {
    parseSchema(schema.additionalProperties, `${path}.additionalProperties`)
  }
  if (schema.propertyNames !== undefined) {
    parseSchema(schema.propertyNames, `${path}.propertyNames`)
  }
  if (schema.items !== undefined) {
    parseSchema(schema.items, `${path}.items`)
  }
  for (const combinator of ['oneOf', 'anyOf'] as const) {
    const variants = schema[combinator]
    if (variants === undefined) {
      continue
    }
    if (!isNonEmptyArray(variants)) {
      throw new Error(`${path}.${combinator}: must be a non-empty array`)
    }
    variants.forEach((variant, i) =>
      parseSchema(variant, `${path}.${combinator}[${i}]`),
    )
  }
  return schema
}

/** Returns every violation as a message with a JSON path; empty means valid. */
export function validateSchema(
  schema: Schema,
  value: unknown,
  path = '$',
): string[] {
  if (schema.type !== undefined && !matchesType(schema.type, value)) {
    const expected = Array.isArray(schema.type)
      ? schema.type.join(' or ')
      : schema.type
    return [`${path}: expected ${expected}, got ${describe(value)}`]
  }
  if ('const' in schema && !deepEqual(schema.const, value)) {
    return [`${path}: expected ${show(schema.const)}, got ${describe(value)}`]
  }
  if (
    schema.enum !== undefined &&
    !schema.enum.some((e) => deepEqual(e, value))
  ) {
    const options = schema.enum.map(show).join(', ')
    return [`${path}: expected one of ${options}, got ${describe(value)}`]
  }

  const errors: string[] = []
  if (schema.oneOf !== undefined) {
    errors.push(...validateOneOf(schema.oneOf, value, path, 'exactly one'))
  }
  if (schema.anyOf !== undefined) {
    errors.push(...validateOneOf(schema.anyOf, value, path, 'at least one'))
  }
  if (typeof value === 'string') {
    errors.push(...validateString(schema, value, path))
  }
  if (typeof value === 'number') {
    errors.push(...validateNumber(schema, value, path))
  }
  if (Array.isArray(value)) {
    errors.push(...validateArray(schema, value, path))
  } else if (isPlainObject(value)) {
    errors.push(...validateObject(schema, value, path))
  }
  return errors
}

function validateOneOf(
  variants: Schema[],
  value: unknown,
  path: string,
  expectation: 'exactly one' | 'at least one',
): string[] {
  const results = variants.map((variant) =>
    validateSchema(variant, value, path),
  )
  const matches = results.filter((errors) => errors.length === 0).length
  const ok = expectation === 'exactly one' ? matches === 1 : matches >= 1
  if (ok) {
    return []
  }
  if (matches > 1) {
    return [`${path}: matches ${matches} alternatives, expected exactly one`]
  }
  const reasons = results
    .map((errors, i) => `(${i + 1}) ${errors.join('; ')}`)
    .join(' ')
  return [
    `${path}: matches none of the ${variants.length} alternatives: ${reasons}`,
  ]
}

function validateString(schema: Schema, value: string, path: string): string[] {
  if (schema.pattern === undefined) {
    return []
  }
  if (compilePattern(schema.pattern, path).test(value)) {
    return []
  }
  return [`${path}: ${show(value)} does not match pattern ${schema.pattern}`]
}

function validateNumber(schema: Schema, value: number, path: string): string[] {
  if (schema.minimum !== undefined && value < schema.minimum) {
    return [`${path}: expected at least ${schema.minimum}, got ${value}`]
  }
  return []
}

function validateArray(
  schema: Schema,
  value: unknown[],
  path: string,
): string[] {
  const errors: string[] = []
  if (schema.minItems !== undefined && value.length < schema.minItems) {
    errors.push(
      `${path}: expected at least ${schema.minItems} item(s), got ${value.length}`,
    )
  }
  if (schema.items !== undefined) {
    const items = schema.items
    value.forEach((item, i) =>
      errors.push(...validateSchema(items, item, `${path}[${i}]`)),
    )
  }
  return errors
}

function validateObject(
  schema: Schema,
  value: Record<string, unknown>,
  path: string,
): string[] {
  const errors: string[] = []
  const properties = schema.properties ?? {}
  for (const name of schema.required ?? []) {
    if (value[name] === undefined) {
      errors.push(`${path}: missing required property "${name}"`)
    }
  }
  for (const [name, property] of Object.entries(value)) {
    const propertyPath = `${path}.${name}`
    const declared = properties[name]
    if (declared !== undefined) {
      errors.push(...validateSchema(declared, property, propertyPath))
      continue
    }
    if (schema.additionalProperties === false) {
      const allowed = Object.keys(properties).map(show).join(', ')
      errors.push(`${propertyPath}: unexpected property (allowed: ${allowed})`)
      continue
    }
    if (schema.propertyNames !== undefined) {
      errors.push(...validateSchema(schema.propertyNames, name, propertyPath))
    }
    if (typeof schema.additionalProperties === 'object') {
      errors.push(
        ...validateSchema(schema.additionalProperties, property, propertyPath),
      )
    }
  }
  return errors
}

function matchesType(type: SchemaType | SchemaType[], value: unknown): boolean {
  const types = Array.isArray(type) ? type : [type]
  return types.some((t) => isOfType(t, value))
}

function isOfType(type: SchemaType, value: unknown): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number'
    case 'integer':
      return Number.isInteger(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'null':
      return value === null
    case 'array':
      return Array.isArray(value)
    case 'object':
      return isPlainObject(value)
  }
}

function checkOptional<K extends keyof Schema>(
  schema: Schema,
  keyword: K,
  path: string,
  predicate: (value: unknown) => boolean,
  expectation: string,
): void {
  const value = schema[keyword]
  if (value !== undefined && !predicate(value)) {
    throw new Error(`${path}.${keyword}: must be ${expectation}`)
  }
}

function compilePattern(pattern: string, path: string): RegExp {
  try {
    return new RegExp(pattern)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`${path}.pattern: invalid regular expression (${reason})`)
  }
}

function isSchemaType(value: unknown): boolean {
  const types = Array.isArray(value) ? value : [value]
  return (
    types.length > 0 &&
    types.every((t) => SCHEMA_TYPES.includes(t as SchemaType))
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNonNegativeInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 0
}

function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Short rendering of a value for messages: type for containers, literal for scalars. */
function describe(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (value === undefined) return 'nothing'
  return show(value)
}

function show(value: unknown): string {
  const json = JSON.stringify(value)
  return json.length > 60 ? `${json.slice(0, 57)}...` : json
}
