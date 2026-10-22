import { expect } from 'earl'
import { undefinedIfEmpty } from './undefinedIfEmpty'

describe('undefinedIfEmpty', () => {
  describe('array overload', () => {
    it('returns undefined for empty array', () => {
      const result = undefinedIfEmpty([])
      expect(result).toEqual(undefined)
    })

    it('returns array for non-empty array', () => {
      const arr = [1, 2, 3]
      const result = undefinedIfEmpty(arr)
      expect(result).toEqual([1, 2, 3])
    })

    it('returns array with single element', () => {
      const arr = ['test']
      const result = undefinedIfEmpty(arr)
      expect(result).toEqual(['test'])
    })

    it('works with string arrays', () => {
      expect(undefinedIfEmpty([] as string[])).toEqual(undefined)
      expect(undefinedIfEmpty(['a', 'b'])).toEqual(['a', 'b'])
    })

    it('works with number arrays', () => {
      expect(undefinedIfEmpty([] as number[])).toEqual(undefined)
      expect(undefinedIfEmpty([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('works with object arrays', () => {
      const empty: { id: number }[] = []
      const nonEmpty = [{ id: 1 }, { id: 2 }]
      expect(undefinedIfEmpty(empty)).toEqual(undefined)
      expect(undefinedIfEmpty(nonEmpty)).toEqual(nonEmpty)
    })
  })

  describe('record overload', () => {
    it('returns undefined for empty record', () => {
      const result = undefinedIfEmpty({})
      expect(result).toEqual(undefined)
    })

    it('returns undefined when all values are undefined', () => {
      const result = undefinedIfEmpty({
        key1: undefined,
        key2: undefined,
      })
      expect(result).toEqual(undefined)
    })

    it('returns record when it has defined values', () => {
      const record = { key1: 'value1', key2: 'value2' }
      const result = undefinedIfEmpty(record)
      expect(result).toEqual(record)
    })

    it('returns record when some values are defined', () => {
      const record = {
        key1: undefined,
        key2: 'value2',
        key3: undefined,
      }
      const result = undefinedIfEmpty(record)
      expect(result).toEqual(record)
    })

    it('returns record when all values are defined', () => {
      const record = { a: 1, b: 2, c: 3 }
      const result = undefinedIfEmpty(record)
      expect(result).toEqual(record)
    })

    it('works with string values', () => {
      expect(undefinedIfEmpty({} as Record<string, string>)).toEqual(undefined)
      expect(undefinedIfEmpty({ a: 'test' })).toEqual({ a: 'test' })
    })

    it('works with number values', () => {
      expect(undefinedIfEmpty({} as Record<string, number>)).toEqual(undefined)
      expect(undefinedIfEmpty({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 })
    })

    it('works with boolean values', () => {
      expect(undefinedIfEmpty({} as Record<string, boolean>)).toEqual(undefined)
      expect(undefinedIfEmpty({ flag: true })).toEqual({ flag: true })
    })

    it('works with object values', () => {
      const empty: Record<string, { id: number }> = {}
      const nonEmpty = { item1: { id: 1 }, item2: { id: 2 } }
      expect(undefinedIfEmpty(empty)).toEqual(undefined)
      expect(undefinedIfEmpty(nonEmpty)).toEqual(nonEmpty)
    })

    it('handles mixed undefined and defined values correctly', () => {
      const record1 = { a: undefined, b: undefined }
      expect(undefinedIfEmpty(record1)).toEqual(undefined)

      const record2 = { a: undefined, b: 'value' }
      expect(undefinedIfEmpty(record2)).toEqual(record2)

      const record3 = { a: 'value', b: undefined }
      expect(undefinedIfEmpty(record3)).toEqual(record3)
    })
  })

  describe('type safety', () => {
    it('preserves array type', () => {
      const arr: string[] = ['a', 'b']
      const result = undefinedIfEmpty(arr)
      // Type check: result should be string[] | undefined
      if (result) {
        expect(result[0]).toEqual('a')
      }
    })

    it('preserves record type', () => {
      const record: Record<string, number> = { x: 1, y: 2 }
      const result = undefinedIfEmpty(record)
      // Type check: result should be Record<string, number> | undefined
      if (result) {
        expect(result.x).toEqual(1)
      }
    })
  })
})
