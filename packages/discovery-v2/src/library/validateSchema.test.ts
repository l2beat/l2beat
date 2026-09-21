import { expect } from 'earl'
import { parseSchema, type Schema, validateSchema } from './validateSchema'

/**
 * Messages are asserted verbatim because they are returned to the model as
 * repair findings; a vague message costs a repair round.
 */
describe(validateSchema.name, () => {
  it('accepts a value that fits and returns no errors', () => {
    const schema: Schema = {
      type: 'object',
      properties: { key: { type: 'string' }, n: { type: 'integer' } },
      required: ['key'],
    }
    expect(validateSchema(schema, { key: 'a', n: 1 })).toEqual([])
  })

  it('names the path and both the expected and actual type', () => {
    const schema: Schema = {
      type: 'object',
      properties: { add: { type: 'array', items: { type: 'string' } } },
    }
    expect(validateSchema(schema, { add: ['ok', 3] })).toEqual([
      '$.add[1]: expected string, got 3',
    ])
  })

  it('reports a missing required property at the object path', () => {
    const schema: Schema = {
      type: 'object',
      properties: { key: { type: 'string' } },
      required: ['key'],
    }
    expect(validateSchema(schema, {})).toEqual([
      '$: missing required property "key"',
    ])
  })

  it('lists the allowed names when a property is not declared', () => {
    const schema: Schema = {
      type: 'object',
      properties: { key: {}, add: {} },
      additionalProperties: false,
    }
    expect(validateSchema(schema, { keys: 'x' })).toEqual([
      '$.keys: unexpected property (allowed: "key", "add")',
    ])
  })

  it('validates map-like objects through propertyNames and additionalProperties', () => {
    const schema: Schema = {
      type: 'object',
      propertyNames: { pattern: '^0x[0-9a-f]{4}$' },
      additionalProperties: { type: 'string' },
    }
    expect(validateSchema(schema, { '0xabcd': 'A' })).toEqual([])
    expect(validateSchema(schema, { nope: 1 })).toEqual([
      '$.nope: "nope" does not match pattern ^0x[0-9a-f]{4}$',
      '$.nope: expected string, got 1',
    ])
  })

  it('enforces minItems, minimum, enum and const with concrete numbers', () => {
    expect(validateSchema({ type: 'array', minItems: 1 }, [])).toEqual([
      '$: expected at least 1 item(s), got 0',
    ])
    expect(validateSchema({ type: 'integer', minimum: 0 }, -1)).toEqual([
      '$: expected at least 0, got -1',
    ])
    expect(validateSchema({ type: 'integer' }, 1.5)).toEqual([
      '$: expected integer, got 1.5',
    ])
    expect(validateSchema({ enum: ['a', 'b'] }, 'c')).toEqual([
      '$: expected one of "a", "b", got "c"',
    ])
    expect(validateSchema({ const: true }, false)).toEqual([
      '$: expected true, got false',
    ])
  })

  it('accepts any JSON value when a property declares no type', () => {
    const schema: Schema = { type: 'object', properties: { equals: {} } }
    for (const value of [1, 'x', true, null, [1], { a: 1 }]) {
      expect(validateSchema(schema, { equals: value })).toEqual([])
    }
  })

  it('accepts a type list and reports the whole list on mismatch', () => {
    const schema: Schema = { type: ['string', 'number'] }
    expect(validateSchema(schema, 'a')).toEqual([])
    expect(validateSchema(schema, 1)).toEqual([])
    expect(validateSchema(schema, true)).toEqual([
      '$: expected string or number, got true',
    ])
  })

  it('explains every failed alternative of a oneOf so the model can pick one', () => {
    const schema: Schema = {
      oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    }
    expect(validateSchema(schema, 'a')).toEqual([])
    expect(validateSchema(schema, ['a'])).toEqual([])
    expect(validateSchema(schema, 1)).toEqual([
      '$: matches none of the 2 alternatives: (1) $: expected string, got 1 (2) $: expected array, got 1',
    ])
  })

  it('rejects a value matching several oneOf alternatives but allows it for anyOf', () => {
    const variants: Schema[] = [{ type: 'integer' }, { type: 'number' }]
    expect(validateSchema({ oneOf: variants }, 1)).toEqual([
      '$: matches 2 alternatives, expected exactly one',
    ])
    expect(validateSchema({ anyOf: variants }, 1)).toEqual([])
  })
})

/**
 * Recipe schemas are hand-written JSON; a misspelt keyword would otherwise
 * silently validate nothing, so schema loading must fail loudly.
 */
describe(parseSchema.name, () => {
  it('returns the schema unchanged when every keyword is supported', () => {
    const schema = {
      type: 'object',
      properties: { a: { type: 'string', description: 'x' } },
      required: ['a'],
    }
    expect(parseSchema(schema)).toEqual(schema as Schema)
  })

  it('rejects unknown keywords with their path', () => {
    expect(() =>
      parseSchema({ type: 'object', properties: { a: { minItem: 1 } } }),
    ).toThrow(/schema\.properties\.a: unsupported keyword "minItem"/)
  })

  it('rejects a required name that is not declared in properties', () => {
    expect(() =>
      parseSchema({
        type: 'object',
        properties: { key: {} },
        required: ['keys'],
      }),
    ).toThrow('schema.required: "keys" is not declared in properties')
  })

  it('rejects unknown type names and invalid patterns', () => {
    expect(() => parseSchema({ type: 'text' })).toThrow(
      'schema.type: must be a known type or list',
    )
    expect(() => parseSchema({ pattern: '(' })).toThrow(
      /schema\.pattern: invalid regular expression/,
    )
  })

  it('validates nested schemas in items, oneOf and additionalProperties', () => {
    expect(() =>
      parseSchema({ type: 'array', items: { type: 'nope' } }),
    ).toThrow('schema.items.type: must be a known type or list')
    expect(() => parseSchema({ oneOf: [] })).toThrow(
      'schema.oneOf: must be a non-empty array',
    )
    expect(() =>
      parseSchema({ type: 'object', additionalProperties: { bogus: 1 } }),
    ).toThrow(/schema\.additionalProperties: unsupported keyword "bogus"/)
  })
})
