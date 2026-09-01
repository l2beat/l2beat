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
    const unpacked = imp.definition.type === 'lazy' ? imp.definition.get() : imp
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

function decompose(imp: Imp<unknown>, state: State): Record<string, unknown> {
  const $ref = state.refs.get(imp)
  if ($ref && !state.skipRefs) {
    return applyMetadata(imp, { $ref })
  }
  state.skipRefs = false

  return applyMetadata(imp, decomposeCore(imp, state))
}

function decomposeCore(
  imp: Imp<unknown>,
  state: State,
): Record<string, unknown> {
  switch (imp.definition.type) {
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
      if (typeof imp.definition.value === 'bigint') {
        return {}
      }
      return { const: imp.definition.value }
    case 'enum':
      return { enum: imp.definition.values }
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      return decompose(imp.definition.parent, state)
    case 'array':
      return {
        type: 'array',
        items: decompose(imp.definition.element, state),
      }
    case 'tuple':
      return {
        type: 'array',
        items: imp.definition.values.map((x) => decompose(x, state)),
        additionalItems: false,
      }
    case 'union':
      return {
        anyOf: imp.definition.values.map((x) => decompose(x, state)),
      }
    case 'object': {
      const result: Record<string, unknown> = {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(imp.definition.schema).map(([k, v]) => [
            k,
            decompose(v, state),
          ]),
        ),
        // true by default according to spec
        ...(imp.definition.strict ? { additionalProperties: false } : {}),
      }
      const required = Object.entries(imp.definition.schema)
        .filter(
          ([_, v]) =>
            v.definition.type !== 'optional' &&
            v.definition.type !== 'default' &&
            v.definition.type !== 'catch',
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
        propertyNames: recordKey(imp.definition.key),
        additionalProperties: decompose(imp.definition.value, state),
      }
      if (imp.definition.key.definition.type === 'enum') {
        result.required = imp.definition.key.definition.values.map((x) =>
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

function applyMetadata(
  imp: Imp<unknown>,
  core: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...core,
    ...imp.metadata,
  }
}

function recordKey(imp: Imp<unknown>): object {
  switch (imp.definition.type) {
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
      if (typeof imp.definition.value === 'string') {
        return { const: imp.definition.value }
      }
      if (typeof imp.definition.value === 'number') {
        return { const: imp.definition.value.toString() }
      }
      return { type: 'string' }
    case 'enum':
      return {
        enum: imp.definition.values.map((x) =>
          (x as string | number).toString(),
        ),
      }
    case 'check':
    case 'transform':
    case 'catch':
    case 'default': // NOTE: Json schema does support this, but not sure if needed
    case 'optional':
      return recordKey(imp.definition.parent)
    case 'union':
      return {
        anyOf: imp.definition.values.map(recordKey),
      }
  }
}
