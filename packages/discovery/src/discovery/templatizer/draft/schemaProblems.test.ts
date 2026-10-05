import { v } from '@l2beat/validate'
import { expect } from 'earl'
import { StorageHandlerDefinition } from '../../handlers/user/StorageHandler'
import { appendKey, schemaProblems } from './schemaProblems'

describe(schemaProblems.name, () => {
  const schema = v.strictObject({
    name: v.string(),
    count: v
      .number()
      .check((n) => Number.isInteger(n) && n >= 0)
      .optional(),
    tags: v.array(v.string()),
    labels: v.record(v.string(), v.boolean()).optional(),
  })

  it('reports every problem with its own path instead of stopping at the first', () => {
    expect(
      schemaProblems(
        schema,
        { nmae: 'x', count: -1, tags: ['a', 3], labels: { ok: 'yes' } },
        'root',
      ),
    ).toEqual([
      {
        path: 'root.nmae',
        message:
          'unexpected key (did you mean "name"?); allowed keys are name, count, tags, labels',
      },
      { path: 'root.name', message: 'missing; expected a string' },
      {
        path: 'root.count',
        message: 'expected a non-negative integer, got -1',
      },
      { path: 'root.tags[1]', message: 'expected a string, got 3' },
      { path: 'root.labels.ok', message: 'expected a boolean, got "yes"' },
    ])
  })

  it('accepts what the schema accepts, including transforms that cannot validate', () => {
    expect(schemaProblems(schema, { name: 'x', tags: [] }, '')).toEqual([])
    expect(
      schemaProblems(
        StorageHandlerDefinition,
        { type: 'storage', slot: '12', offset: '{{ base }}' },
        'h',
      ),
    ).toEqual([])
    expect(
      schemaProblems(
        StorageHandlerDefinition,
        { type: 'storage', slot: -1 },
        'h',
      ),
    ).toEqual([
      {
        path: 'h.slot',
        message:
          'expected a slot (a non-negative integer, a 0x hex string, a decimal string or a reference such as "{{ field }}"), or a non-empty array of slots hashed into a mapping slot, got -1',
      },
    ])
  })

  it('reports a key no schema names inside objects V1 does not declare strict', () => {
    const lenient = v.object({ event: v.string() })
    expect(schemaProblems(lenient, { event: 'A', wher: 1 }, 'a')).toEqual([
      {
        path: 'a.wher',
        message: 'unexpected key; allowed keys are event',
      },
    ])
  })

  it('walks a union into the member its `type` names, spreading nested unions, or names the types', () => {
    const handler = v.union([
      v.strictObject({ type: v.literal('call'), args: v.array(v.number()) }),
      v.union([
        v.strictObject({ type: v.literal('event'), set: v.string() }),
        v.strictObject({ type: v.literal('event'), add: v.string() }),
      ]),
    ])
    expect(schemaProblems(handler, { type: 'call' }, 'h')).toEqual([
      {
        path: 'h.args',
        message: 'missing; expected an array, each element a number',
      },
    ])
    expect(
      schemaProblems(handler, { type: 'event', add: 'X', flatten: 1 }, 'h'),
    ).toEqual([
      {
        path: 'h.flatten',
        message: 'unexpected key; allowed keys are type, add',
      },
    ])
    expect(schemaProblems(handler, { type: 'evnt' }, 'h')).toEqual([
      {
        path: 'h.type',
        message:
          'expected one of "call", "event" (did you mean "event"?), got "evnt"',
      },
    ])
  })
})

describe(appendKey.name, () => {
  it('spells identifiers with a dot and anything else in brackets', () => {
    expect(appendKey('', 'fields')).toEqual('fields')
    expect(appendKey('fields', 'sequencers')).toEqual('fields.sequencers')
    expect(appendKey('roleNames', '0xAB')).toEqual('roleNames["0xAB"]')
  })
})
