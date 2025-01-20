import { expect } from 'earl'
import { resolveReferenceFromValues } from './reference'

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
    expect(result).toEqual({ a: [123, 42], b: 'hello' })
  })

  it('resolves to correct', () => {
    const result1 = resolveReferenceFromValues('{{key}}', { key: 123 })
    const result2 = resolveReferenceFromValues('{{keyToZero}}', {
      key: 123,
      keyToZero: 0,
    })
    expect(result1).toEqual(123)
    expect(result2).toEqual(0)
  })

  it('ignores if in single braces', () => {
    const result = resolveReferenceFromValues('{lorem}', {})
    expect(result).toEqual('{lorem}')
  })

  it('ignores if not in braces', () => {
    const result = resolveReferenceFromValues('lorem', {})
    expect(result).toEqual('lorem')
  })
})
