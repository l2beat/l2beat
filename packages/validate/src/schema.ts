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

  switch (imp.meta.type) {
    case 'unknown':
      // Anything is accepted
      return {}
    case 'boolean':
      return { type: 'boolean' }
    case 'number':
      return { type: 'number' }
    case 'string':
      return { type: 'string' }
    case 'null':
      return { type: 'null' }
    case 'bigint':
    case 'undefined':
      // Those are not supported so we cannot say anything about them
      return {}
    case 'literal':
      if (typeof imp.meta.value === 'bigint') {
        return {}
      }
      return { const: imp.meta.value }
    case 'enum':
      return { enum: imp.meta.values }
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      return decompose(imp.meta.parent, state)
    case 'array':
      return {
        type: 'array',
        items: decompose(imp.meta.element, state),
      }
    case 'tuple':
      return {
        type: 'array',
        items: imp.meta.values.map((x) => decompose(x, state)),
        additionalItems: false,
      }
    case 'union':
      return {
        anyOf: imp.meta.values.map((x) => decompose(x, state)),
      }
    case 'object': {
      const result: Record<string, unknown> = {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(imp.meta.schema).map(([k, v]) => [
            k,
            decompose(v, state),
          ]),
        ),
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
        result.required = required
      }
      return result
    }
    case 'record': {
      const result: Record<string, unknown> = {
        type: 'object',
        propertyNames: recordKey(imp.meta.key),
        additionalProperties: decompose(imp.meta.value, state),
      }
      if (imp.meta.key.meta.type === 'enum') {
        result.required = imp.meta.key.meta.values.map((x) =>
          (x as string | number).toString(),
        )
      }
      return result
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
}

function recordKey(imp: Imp<unknown>): object {
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
      return { type: 'string' }
    case 'boolean':
      return { enum: ['true', 'false'] }
    case 'number':
      return { type: 'string', pattern: '\\d+(\\.\\d*)?' }
    case 'literal':
      if (typeof imp.meta.value === 'string') {
        return { const: imp.meta.value }
      }
      if (typeof imp.meta.value === 'number') {
        return { const: imp.meta.value.toString() }
      }
      return { type: 'string' }
    case 'enum':
      return {
        enum: imp.meta.values.map((x) => (x as string | number).toString()),
      }
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      return recordKey(imp.meta.parent)
    case 'union':
      return {
        anyOf: imp.meta.values.map(recordKey),
      }
  }
}
