import { expect } from 'earl'
import { validateBlip } from './validateBlip'

describe(validateBlip.name, () => {
  describe('primitive values', () => {
    it('validates strings as valid', () => {
      expect(validateBlip('hello')).toBeTruthy()
      expect(validateBlip('')).toBeTruthy()
    })

    it('validates numbers as valid', () => {
      expect(validateBlip(123)).toBeTruthy()
      expect(validateBlip(0)).toBeTruthy()
      expect(validateBlip(-10.5)).toBeTruthy()
    })

    it('validates booleans as valid', () => {
      expect(validateBlip(true)).toBeTruthy()
      expect(validateBlip(false)).toBeTruthy()
    })

    it('rejects other primitive types', () => {
      expect(validateBlip(undefined)).toBeFalsy()
      expect(validateBlip(null)).toBeFalsy()
      expect(validateBlip(Symbol('test'))).toBeFalsy()
      expect(validateBlip(123n)).toBeFalsy()
    })

    it('rejects objects', () => {
      expect(validateBlip({})).toBeFalsy()
      expect(validateBlip({ key: 'value' })).toBeFalsy()
    })

    it('rejects empty arrays', () => {
      expect(validateBlip([])).toBeFalsy()
    })
  })

  describe('array operations', () => {
    it('validates "not" operation', () => {
      expect(validateBlip(['not'])).toBeFalsy() // Empty not is invalid
      expect(validateBlip(['not', 'value'])).toBeTruthy()
      expect(validateBlip(['not', 123])).toBeTruthy()
      expect(validateBlip(['not', true])).toBeTruthy()
      expect(validateBlip(['not', ['=', 1, 2]])).toBeTruthy() // Nested valid blip
      expect(validateBlip(['not', {}])).toBeFalsy() // Invalid sub-element
      expect(validateBlip(['not', 123n])).toBeFalsy() // Invalid sub-element
    })

    it('validates "=" operation', () => {
      expect(validateBlip(['='])).toBeFalsy() // Empty = is invalid
      expect(validateBlip(['=', 123])).toBeTruthy()
      expect(validateBlip(['=', 'value'])).toBeTruthy()
      expect(validateBlip(['=', 123, 'value'])).toBeTruthy() // Multiple arguments
      expect(validateBlip(['=', ['and', true, false], 123])).toBeTruthy() // Nested valid blips
      expect(validateBlip(['=', {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "!=" operation', () => {
      expect(validateBlip(['!='])).toBeFalsy() // Empty != is invalid
      expect(validateBlip(['!=', 123])).toBeTruthy()
      expect(validateBlip(['!=', 'value'])).toBeTruthy()
      expect(validateBlip(['!=', 123, 'value'])).toBeTruthy() // Multiple arguments
      expect(validateBlip(['!=', ['and', true, false], 123])).toBeTruthy() // Nested valid blips
      expect(validateBlip(['!=', {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "and" operation', () => {
      expect(validateBlip(['and'])).toBeFalsy() // Empty and is invalid
      expect(validateBlip(['and', 123])).toBeTruthy()
      expect(validateBlip(['and', 123, false])).toBeTruthy()
      expect(validateBlip(['and', 123, false, 'string'])).toBeTruthy()
      expect(validateBlip(['and', ['=', 1, 2], ['!=', 3, 4]])).toBeTruthy() // Nested valid blips
      expect(validateBlip(['and', 123, false, {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "pipe" operation', () => {
      expect(validateBlip(['pipe'])).toBeFalsy() // Empty pipe is invalid
      expect(validateBlip(['pipe', 123])).toBeTruthy()
      expect(validateBlip(['pipe', 123, false, 'string'])).toBeTruthy()
      expect(validateBlip(['pipe', ['map', 123], ['get', 'prop']])).toBeTruthy() // Nested valid blips
      expect(validateBlip(['pipe', 123, {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "map" operation', () => {
      expect(validateBlip(['map'])).toBeFalsy() // Empty map is invalid
      expect(validateBlip(['map', 123])).toBeTruthy() // Valid with exactly one argument
      expect(validateBlip(['map', ['get', 'prop']])).toBeTruthy() // Valid with nested blip
      expect(validateBlip(['map', 123, 456])).toBeFalsy() // Too many arguments
      expect(validateBlip(['map', {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "pick" operation', () => {
      expect(validateBlip(['pick'])).toBeFalsy() // Empty pick is invalid
      expect(validateBlip(['pick', 123])).toBeTruthy()
      expect(validateBlip(['pick', 'prop1', 'prop2'])).toBeTruthy() // Multiple arguments
      expect(validateBlip(['pick', ['get', 'prop'], 123])).toBeTruthy() // Nested valid blips
      expect(validateBlip(['pick', 123, {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "get" operation', () => {
      expect(validateBlip(['get'])).toBeFalsy() // Empty get is invalid
      expect(validateBlip(['get', 'prop'])).toBeTruthy() // String property
      expect(validateBlip(['get', 123])).toBeTruthy() // Numeric index
      expect(validateBlip(['get', 'prop1', 'prop2'])).toBeTruthy() // Multiple path segments
      expect(validateBlip(['get', {}])).toBeFalsy() // Invalid path segment
      expect(validateBlip(['get', ['and', true]])).toBeFalsy() // Arrays not allowed as path segments
    })

    it('validates "set" operation', () => {
      expect(validateBlip(['set'])).toBeFalsy() // Too few arguments
      expect(validateBlip(['set', 'prop'])).toBeFalsy() // Too few arguments
      expect(validateBlip(['set', 'prop', 123])).toBeTruthy() // Valid
      expect(validateBlip(['set', 123, 'value'])).toBeTruthy() // Numeric key
      expect(validateBlip(['set', ['prop1', 'prop2'], 'value'])).toBeTruthy() // Array of path segments
      expect(validateBlip(['set', 'prop', ['get', 'value']])).toBeTruthy() // Nested blip as value
      expect(validateBlip(['set', {}, 'value'])).toBeFalsy() // Invalid key
      expect(validateBlip(['set', 'prop', 'value', 'extra'])).toBeFalsy() // Too many arguments
    })

    it('validates "filter" operation', () => {
      expect(validateBlip(['filter'])).toBeFalsy() // Empty filter is invalid
      expect(validateBlip(['filter', 123])).toBeTruthy() // Valid with exactly one argument
      expect(validateBlip(['filter', ['get', 'prop']])).toBeTruthy() // Valid with nested blip
      expect(validateBlip(['filter', 123, 456])).toBeFalsy() // Too many arguments
      expect(validateBlip(['filter', {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "find" operation', () => {
      expect(validateBlip(['find'])).toBeFalsy() // Empty find is invalid
      expect(validateBlip(['find', 123])).toBeTruthy() // Valid with exactly one argument
      expect(validateBlip(['find', ['get', 'prop']])).toBeTruthy() // Valid with nested blip
      expect(validateBlip(['find', 123, 456])).toBeFalsy() // Too many arguments
      expect(validateBlip(['find', {}])).toBeFalsy() // Invalid sub-element
    })

    it('validates "format" operation', () => {
      expect(validateBlip(['format'])).toBeFalsy() // Too few arguments
      expect(validateBlip(['format', 'Hello {0}'])).toBeTruthy() // Valid
      expect(validateBlip(['format', 123])).toBeFalsy() // Format must be string
      expect(validateBlip(['format', 'Hello {0}', 'extra'])).toBeFalsy() // Too many arguments
    })

    it('validates "if" operation', () => {
      expect(validateBlip(['if'])).toBeFalsy() // Too few arguments
      expect(validateBlip(['if', true])).toBeFalsy() // Too few arguments
      expect(validateBlip(['if', true, 'then'])).toBeFalsy() // Too few arguments
      expect(validateBlip(['if', true, 'then', 'else'])).toBeTruthy() // Valid
      expect(
        validateBlip(['if', ['=', 1, 1], ['get', 'prop'], false]),
      ).toBeTruthy() // Nested blips
      expect(validateBlip(['if', {}, 'then', 'else'])).toBeFalsy() // Invalid condition
      expect(validateBlip(['if', true, {}, 'else'])).toBeFalsy() // Invalid then branch
      expect(validateBlip(['if', true, 'then', {}])).toBeFalsy() // Invalid else branch
      expect(validateBlip(['if', true, 'then', 'else', 'extra'])).toBeFalsy() // Too many arguments
    })

    it('validates "delete" operation', () => {
      expect(validateBlip(['delete'])).toBeFalsy() // Empty delete is invalid
      expect(validateBlip(['delete', 'prop'])).toBeTruthy() // String property
      expect(validateBlip(['delete', 123])).toBeTruthy() // Numeric index
      expect(validateBlip(['delete', 'prop1', 'prop2'])).toBeTruthy() // Multiple path segments
      expect(validateBlip(['delete', {}])).toBeFalsy() // Invalid path segment
      expect(validateBlip(['delete', ['and', true]])).toBeFalsy() // Arrays not allowed as path segments
    })

    it('validates "shape" operation', () => {
      expect(validateBlip(['shape'])).toBeFalsy() // Empty shape is invalid
      expect(validateBlip(['shape', 'prop'])).toBeTruthy() // String property
      expect(validateBlip(['shape', ['key', 'value']])).toBeTruthy() // Key-value pair
      expect(validateBlip(['shape', ['key', 123]])).toBeTruthy() // Key-value with number
      expect(validateBlip(['shape', ['key', ['get', 'prop']]])).toBeTruthy() // Nested blip as value
      expect(validateBlip(['shape', 'prop1', ['key2', 'value2']])).toBeTruthy() // Mixed string and pairs
      expect(validateBlip(['shape', ['key']])).toBeFalsy() // Invalid pair (too short)
      expect(validateBlip(['shape', ['key', 'value', 'extra']])).toBeFalsy() // Invalid pair (too long)
      expect(validateBlip(['shape', [123, 'value']])).toBeFalsy() // Non-string key
    })

    it('validates "to_entries" operation', () => {
      expect(validateBlip(['to_entries'])).toBeTruthy() // Empty to_entries is valid
      expect(validateBlip(['to_entries', 'prop'])).toBeFalsy() // String property
      expect(validateBlip(['to_entries', ['key', 'value']])).toBeFalsy() // Key-value pair
      expect(validateBlip(['to_entries', ['key', 123]])).toBeFalsy() // Key-value with number
      expect(validateBlip(['to_entries', ['key', ['get', 'prop']]])).toBeFalsy() // Nested blip as value
      expect(
        validateBlip(['to_entries', 'prop1', ['key2', 'value2']]),
      ).toBeFalsy() // Mixed string and pairs
      expect(validateBlip(['to_entries', ['key']])).toBeFalsy() // Invalid pair (too short)
      expect(
        validateBlip(['to_entries', ['key', 'value', 'extra']]),
      ).toBeFalsy() // Invalid pair (too long)
      expect(validateBlip(['to_entries', [123, 'value']])).toBeFalsy() // Non-string key
    })

    it('rejects unknown operations', () => {
      expect(validateBlip(['unknownOp', 123])).toBeFalsy()
      expect(validateBlip(['invalid', true, false])).toBeFalsy()
      expect(validateBlip([123, 'not-an-op'])).toBeFalsy() // First element must be string
    })
  })
})
