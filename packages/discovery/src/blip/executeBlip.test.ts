import { expect } from 'earl'
import { executeBlip } from './executeBlip'

describe(executeBlip.name, () => {
  // Contract value tests
  describe('contract value operations', () => {
    const contractValue = { a: 1, b: 'test' }

    it('can use contract values in comparisons', () => {
      expect(executeBlip(contractValue, ['=', 1, contractValue.a])).toEqual(
        true,
      )
      expect(
        executeBlip(contractValue, ['=', 'test', contractValue.b]),
      ).toEqual(true)
      expect(executeBlip(contractValue, ['!=', 2, contractValue.a])).toEqual(
        true,
      )
    })

    it('handles complex contract value expressions', () => {
      expect(
        executeBlip(contractValue, [
          'and',
          contractValue.a, // truthy check
          ['!=', contractValue.b, 'invalid'],
          ['=', contractValue.a, 1],
        ]),
      ).toEqual(true)
    })
  })

  it('supports complex nested logical expressions', () => {
    expect(
      executeBlip({}, [
        'and',
        ['not', false],
        'test',
        ['!=', 1, 2],
        ['=', 1, 1],
      ]),
    ).toEqual(true)

    expect(
      executeBlip({}, ['and', ['not', true], 'test', ['=', 1, 1]]),
    ).toEqual(false)
  })

  it('returns true only if all arguments are truthy', () => {
    expect(executeBlip({}, ['and', true, true, true])).toEqual(true)
    expect(executeBlip({}, ['and', true, false, true])).toEqual(false)
    expect(executeBlip({}, ['and', true, true, false])).toEqual(false)
    expect(executeBlip({}, ['and', 1, 'hello', true])).toEqual(true)
    expect(executeBlip({}, ['and', 1, '', true])).toEqual(false)
  })

  it('handles multiple and nested expressions', () => {
    expect(executeBlip({}, ['and', true, 1, ['not', false]])).toEqual(true)
    expect(executeBlip({}, ['and', true, 0, ['not', false]])).toEqual(false)
  })

  describe('equality comparisons', () => {
    it('compares multiple values for equality', () => {
      expect(executeBlip({}, ['=', 1, 1, 1])).toEqual(true)
      expect(executeBlip({}, ['=', 1, 2, 1])).toEqual(false)
      expect(executeBlip({}, ['=', 'a', 'a', 'a'])).toEqual(true)
      expect(executeBlip({}, ['=', 'a', 'b', 'a'])).toEqual(false)
    })

    it('works with different types', () => {
      expect(executeBlip({}, ['=', 1, '1'])).toEqual(false)
    })
  })

  describe('inequality comparisons', () => {
    it('compares multiple values for inequality', () => {
      expect(executeBlip({}, ['!=', 1, 2, 3])).toEqual(true)
      expect(executeBlip({}, ['!=', 1, 1, 2])).toEqual(true)
      expect(executeBlip({}, ['!=', 1, 1, 1])).toEqual(false)
      expect(executeBlip({}, ['!=', 'a', 'a', 'b'])).toEqual(true)
      expect(executeBlip({}, ['!=', 'a', 'b', 'c'])).toEqual(true)
      expect(executeBlip({}, ['!=', 'a', 'a', 'a'])).toEqual(false)
    })

    it('works with different types', () => {
      expect(executeBlip({}, ['!=', 1, '1'])).toEqual(true)
      expect(executeBlip({}, ['!=', 0, false])).toEqual(true)
    })
  })

  it('negates boolean values', () => {
    expect(executeBlip({}, ['not', true])).toEqual(false)
    expect(executeBlip({}, ['not', false])).toEqual(true)
  })

  it('handles nested not operations', () => {
    expect(executeBlip({}, ['not', ['not', true]])).toEqual(true)
    expect(executeBlip({}, ['not', ['not', false]])).toEqual(false)
  })

  it('executes simple values', () => {
    expect(executeBlip({}, 'string')).toEqual('string')
    expect(executeBlip({}, 123)).toEqual(123)
    expect(executeBlip({}, 0)).toEqual(0)
    expect(executeBlip({}, false)).toEqual(false)
    expect(executeBlip({}, true)).toEqual(true)
  })
})
