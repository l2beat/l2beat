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
})

describe(appendKey.name, () => {
  it('spells identifiers with a dot and anything else in brackets', () => {
    expect(appendKey('', 'fields')).toEqual('fields')
    expect(appendKey('fields', 'sequencers')).toEqual('fields.sequencers')
    expect(appendKey('roleNames', '0xAB')).toEqual('roleNames["0xAB"]')
  })
})
