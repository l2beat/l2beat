import type { Parser } from './validate.js'
import { v } from './validate.js'

export interface JsonSchema {
  $schema?: string
  $ref?: string
  type?: string | string[]
  const?: unknown
  enum?: unknown[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  additionalProperties?: boolean | JsonSchema
  items?: JsonSchema | JsonSchema[]
  additionalItems?: boolean
  anyOf?: JsonSchema[]
  allOf?: JsonSchema[]
  oneOf?: JsonSchema[]
  definitions?: Record<string, JsonSchema>
  propertyNames?: JsonSchema
  [key: string]: unknown
}

interface ConversionContext {
  definitions: Map<string, Parser<unknown>>
  lazyRefs: Map<string, () => Parser<unknown>>
  root: JsonSchema
}

export function fromJsonSchema(schema: JsonSchema): Parser<unknown> {
  const context: ConversionContext = {
    definitions: new Map(),
    lazyRefs: new Map(),
    root: schema,
  }

  if (schema.definitions) {
    for (const [key, def] of Object.entries(schema.definitions)) {
      const refPath = `#/definitions/${key}`
      context.lazyRefs.set(refPath, () => {
        let cached = context.definitions.get(refPath)
        if (!cached) {
          cached = convertSchema(def, context)
          context.definitions.set(refPath, cached)
        }
        return cached
      })
    }
  }

  return convertSchema(schema, context)
}

function convertSchema(
  schema: JsonSchema,
  context: ConversionContext,
): Parser<unknown> {
  if (schema.$ref) {
    return resolveRef(schema.$ref, context)
  }

  if (schema.anyOf && schema.anyOf.length > 0) {
    const variants = schema.anyOf.map((s) => convertSchema(s, context))
    return v.union(variants as [Parser<unknown>, Parser<unknown>])
  }

  if (schema.allOf && schema.allOf.length > 0) {
    const first = schema.allOf[0]
    if (first) {
      return convertSchema(first, context)
    }
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    const variants = schema.oneOf.map((s) => convertSchema(s, context))
    return v.union(variants as [Parser<unknown>, Parser<unknown>])
  }

  if ('const' in schema) {
    return v.literal(schema.const as string | number | boolean | bigint)
  }

  if (schema.enum && schema.enum.length > 0) {
    return v.enum(schema.enum as readonly (string | number)[])
  }

  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type

  switch (type) {
    case 'string':
      return v.string()
    case 'number':
    case 'integer':
      return v.number()
    case 'boolean':
      return v.boolean()
    case 'null':
      return v.null()
    case 'array':
      return convertArray(schema, context)
    case 'object':
      return convertObject(schema, context)
    default:
      return v.unknown()
  }
}

function convertArray(
  schema: JsonSchema,
  context: ConversionContext,
): Parser<unknown> {
  if (Array.isArray(schema.items)) {
    const elements = schema.items.map((item) => convertSchema(item, context))
    return v.tuple(elements as [Parser<unknown>])
  }

  if (schema.items) {
    const element = convertSchema(schema.items, context)
    return v.array(element)
  }

  return v.array(v.unknown())
}

function convertObject(
  schema: JsonSchema,
  context: ConversionContext,
): Parser<unknown> {
  if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object' &&
    (!schema.properties || Object.keys(schema.properties).length === 0)
  ) {
    const keySchema = schema.propertyNames || { type: 'string' }
    const key = convertSchema(keySchema, context)
    const value = convertSchema(schema.additionalProperties, context)
    return v.record(key as Parser<string | number>, value)
  }

  const properties: Record<string, Parser<unknown>> = {}

  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      let parser = convertSchema(prop, context)

      const isRequired = schema.required?.includes(key) ?? false
      if (!isRequired) {
        parser = parser.optional()
      }

      properties[key] = parser
    }
  }

  const strict = schema.additionalProperties === false
  const passthrough =
    schema.additionalProperties === true ||
    schema.additionalProperties === undefined

  if (strict) {
    return v.strictObject(properties)
  }

  if (passthrough) {
    return v.passthroughObject(properties)
  }

  return v.object(properties)
}

function resolveRef(ref: string, context: ConversionContext): Parser<unknown> {
  if (ref.startsWith('#/definitions/')) {
    const lazyGetter = context.lazyRefs.get(ref)
    if (!lazyGetter) {
      throw new Error(`Reference not found: ${ref}`)
    }

    return v.lazy(lazyGetter)
  }

  if (ref === '#') {
    return v.lazy(() => convertSchema(context.root, context))
  }

  throw new Error(`Unsupported $ref format: ${ref}`)
}
