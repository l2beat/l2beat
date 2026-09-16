import { describe, expect, it } from 'vitest'
import {
  getReferencedName,
  getReferencedPath,
  resolveReference,
  resolveReferenceFromValues,
} from './reference'

describe(getReferencedName.name, () => {
  it('returns the field name of a flat reference', () => {
    expect(getReferencedName('{{ owner }}')).toStrictEqual('owner')
  })

  it('returns only the base field of a nested reference', () => {
    expect(getReferencedName('{{ constructorArgs._owner }}')).toStrictEqual(
      'constructorArgs',
    )
  })

  it('returns only the base field of a deeply nested reference', () => {
    expect(getReferencedName('{{ foo.bar.baz }}')).toStrictEqual('foo')
  })

  it('returns the base field of a $-prefixed reference', () => {
    expect(getReferencedName('{{ $.address }}')).toStrictEqual('$')
  })

  it('returns undefined for a value that is not a reference', () => {
    expect(getReferencedName('owner')).toStrictEqual(undefined)
    expect(getReferencedName('{owner}')).toStrictEqual(undefined)
    expect(getReferencedName(123)).toStrictEqual(undefined)
  })
})

describe(getReferencedPath.name, () => {
  it('keeps the whole path of a nested reference', () => {
    expect(getReferencedPath('{{ constructorArgs._owner }}')).toStrictEqual(
      'constructorArgs._owner',
    )
  })

  it('equals the field name for a flat reference', () => {
    expect(getReferencedPath('{{ owner }}')).toStrictEqual('owner')
  })

  it('returns undefined for a value that is not a reference', () => {
    expect(getReferencedPath('owner')).toStrictEqual(undefined)
  })
})

describe(resolveReference.name, () => {
  it('walks the whole path, not just the base field', () => {
    const resolved = resolveReference('{{ constructorArgs._owner }}', {
      constructorArgs: { _owner: 'alice' },
    })

    expect(resolved).toStrictEqual('alice')
  })

  it('throws when the sub-path is missing', () => {
    expect(() =>
      resolveReference('{{ constructorArgs._owner }}', {
        constructorArgs: { _other: 'alice' },
      }),
    ).toThrow('Missing dependency: constructorArgs._owner')
  })
})

describe('references', () => {
  it('throws if not found', () => {
    const values = {
      differentKey: { a: [123, 42], b: 'hello' },
    }

    expect(() => resolveReferenceFromValues('{{key}}', values)).toThrow(
      'Missing',
    )
  })

  it('resolves to complex objects', () => {
    const result = resolveReferenceFromValues('{{key}}', {
      key: { a: [123, 42], b: 'hello' },
    })
    expect(result).toStrictEqual({ a: [123, 42], b: 'hello' })
  })

  it('resolves to correct', () => {
    const result1 = resolveReferenceFromValues('{{key}}', { key: 123 })
    const result2 = resolveReferenceFromValues('{{keyToZero}}', {
      key: 123,
      keyToZero: 0,
    })
    expect(result1).toStrictEqual(123)
    expect(result2).toStrictEqual(0)
  })

  it('ignores if in single braces', () => {
    const result = resolveReferenceFromValues('{lorem}', {})
    expect(result).toStrictEqual('{lorem}')
  })

  it('ignores if not in braces', () => {
    const result = resolveReferenceFromValues('lorem', {})
    expect(result).toStrictEqual('lorem')
  })
})
