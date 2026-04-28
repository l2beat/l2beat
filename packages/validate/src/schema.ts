import type { Imp, Parser } from './validate.js'

export const SCHEMA_VERSION = 'https://json-schema.org/draft-07/schema#'

export function toJsonSchema(
  schema: Parser<unknown>,
  topLevel: Record<string, Parser<unknown>> = {},
): object {
  const remaining = Object.entries(topLevel) as [string, Imp<unknown>][]
  const state: State = {
    refs: new Map(remaining.map(([k, v]) => [v, `#/definitions/${k}`])),
    lazyCounter: 0,
    remaining,
    skipRefs: false,
  }
  const decomposed = decompose(schema as Imp<unknown>, state)
  if (state.remaining.length === 0) {
    return { $schema: SCHEMA_VERSION, ...decomposed }
  }
  const definitions: Record<string, object> = {}
  while (state.remaining.length > 0) {
    // biome-ignore lint/style/noNonNullAssertion: It's there
    const [key, imp] = state.remaining.shift()!
    const unpacked = imp.meta.type === 'lazy' ? imp.meta.get() : imp
    state.skipRefs = true
    definitions[key] = decompose(unpacked, state)
  }
  return {
    $schema: SCHEMA_VERSION,
    definitions,
    ...decomposed,
  }
}

interface State {
  remaining: [string, Imp<unknown>][]
  refs: Map<Imp<unknown>, string>
  lazyCounter: number
  skipRefs: boolean
}

function decompose(imp: Imp<unknown>, state: State): object {
  const $ref = state.refs.get(imp)
  if ($ref && !state.skipRefs) {
    return { $ref }
  }
  state.skipRefs = false

  let result: object

  switch (imp.meta.type) {
    case 'unknown':
      // Anything is accepted
      result = {}
      break
    case 'boolean':
      result = { type: 'boolean' }
      break
    case 'number':
      result = { type: 'number' }
      break
    case 'string':
      result = { type: 'string' }
      break
    case 'null':
      result = { type: 'null' }
      break
    case 'bigint':
    case 'undefined':
      // Those are not supported so we cannot say anything about them
      result = {}
      break
    case 'literal':
      if (typeof imp.meta.value === 'bigint') {
        result = {}
      } else {
        result = { const: imp.meta.value }
      }
      break
    case 'enum':
      result = { enum: imp.meta.values }
      break
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      result = decompose(imp.meta.parent, state)
      break
    case 'array':
      result = {
        type: 'array',
        items: decompose(imp.meta.element, state),
      }
      break
    case 'tuple':
      result = {
        type: 'array',
        items: imp.meta.values.map((x) => decompose(x, state)),
        additionalItems: false,
      }
      break
    case 'union':
      result = {
        anyOf: imp.meta.values.map((x) => decompose(x, state)),
      }
      break
    case 'object': {
      const schema: Record<string, unknown> = {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(imp.meta.schema).map(([k, v]) => [
            k,
            decompose(v, state),
          ]),
        ),
        // true by default according to spec
        ...(imp.meta.strict ? { additionalProperties: false } : {}),
      }
      const required = Object.entries(imp.meta.schema)
        .filter(
          ([_, v]) =>
            v.meta.type !== 'optional' &&
            v.meta.type !== 'default' &&
            v.meta.type !== 'catch',
        )
        .map(([k]) => k)
      if (required.length > 0) {
        schema.required = required
      }
      result = schema
      break
    }
    case 'record': {
      const schema: Record<string, unknown> = {
        type: 'object',
        propertyNames: recordKey(imp.meta.key),
        additionalProperties: decompose(imp.meta.value, state),
      }
      if (imp.meta.key.meta.type === 'enum') {
        schema.required = imp.meta.key.meta.values.map((x) =>
          (x as string | number).toString(),
        )
      }
      result = schema
      break
    }
    case 'lazy': {
      state.lazyCounter++
      const key = `__lazy_${state.lazyCounter}`
      const $ref = `#/definitions/${key}`
      state.refs.set(imp, $ref)
      state.remaining.push([key, imp])
      return { $ref }
    }
  }

  // Meta fields
  if (imp.description) {
    result = { ...result, description: imp.description }
  }

  return result
}

function recordKey(imp: Imp<unknown>): object {
  let result: object
  switch (imp.meta.type) {
    case 'unknown':
    case 'string':
    case 'null':
    case 'bigint':
    case 'undefined':
    case 'array':
    case 'tuple':
    case 'object':
    case 'record':
    case 'lazy':
      result = { type: 'string' }
      break
    case 'boolean':
      result = { enum: ['true', 'false'] }
      break
    case 'number':
      result = {
        type: 'string',
        pattern: '\\d+(\\.\\d*)?',
        description: imp.description,
      }
      break
    case 'literal':
      if (typeof imp.meta.value === 'string') {
        result = { const: imp.meta.value }
        break
      }
      if (typeof imp.meta.value === 'number') {
        result = {
          const: imp.meta.value.toString(),
          description: imp.description,
        }
        break
      }
      result = { type: 'string' }
      break
    case 'enum':
      result = {
        enum: imp.meta.values.map((x) => (x as string | number).toString()),
        description: imp.description,
      }
      break
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      return recordKey(imp.meta.parent)
    case 'union':
      result = {
        anyOf: imp.meta.values.map(recordKey),
      }
      break
  }
  if (imp.description) {
    result = { ...result, description: imp.description }
  }
  return result
}
