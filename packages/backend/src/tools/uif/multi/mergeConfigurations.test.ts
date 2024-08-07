import { expect } from 'earl'

import { mergeConfigurations } from './mergeConfigurations'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

const SERIALIZE = (v: unknown) => JSON.stringify(v)
const EMPTY_DIFF = { toAdd: [], toUpdate: [], toDelete: [], toRemoveData: [] }

describe(mergeConfigurations.name, () => {
  describe('errors', () => {
    it('duplicate config id', () => {
      expect(() =>
        mergeConfigurations(
          [],
          [actual('a', 100, null), actual('a', 200, 300)],
          SERIALIZE,
        ),
      ).toThrow(/a is duplicated/)
    })

    it('minHeight greater than maxHeight', () => {
      expect(() =>
        mergeConfigurations([], [actual('a', 200, 100)], SERIALIZE),
      ).toThrow(/a has minHeight greater than maxHeight/)
    })
  })

  describe('regular sync', () => {
    it('empty actual throws', () => {
      expect(() => mergeConfigurations([], [], SERIALIZE)).toThrow()
    })

    it('empty saved', () => {
      const result = mergeConfigurations(
        [],
        [actual('a', 100, null), actual('b', 200, 300)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toAdd: [actual('a', 100, null), actual('b', 200, 300)],
        },
        configurations: [
          { ...actual('a', 100, null), currentHeight: null },
          { ...actual('b', 200, 300), currentHeight: null },
        ],
        safeHeight: 99,
      })
    })

    it('partially synced, both early', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 300), saved('b', 200, null, 300)],
        [actual('a', 100, 400), actual('b', 200, null)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: { ...EMPTY_DIFF },
        configurations: [
          { ...actual('a', 100, 400), currentHeight: 300 },
          { ...actual('b', 200, null), currentHeight: 300 },
        ],
        safeHeight: 300,
      })
    })

    it('partially synced, one new not yet started', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 300), saved('b', 555, null, null)],
        [actual('a', 100, 400), actual('b', 555, null)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: EMPTY_DIFF,
        configurations: [
          { ...actual('a', 100, 400), currentHeight: 300 },
          { ...actual('b', 555, null), currentHeight: null },
        ],
        safeHeight: 300,
      })
    })

    it('partially synced, one finished', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 555, 400), saved('b', 200, 300, 300)],
        [actual('a', 100, 555), actual('b', 200, 300)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: EMPTY_DIFF,
        configurations: [
          { ...actual('a', 100, 555), currentHeight: 400 },
          {
            ...actual('b', 200, 300),
            currentHeight: 300,
          },
        ],
        safeHeight: 300,
      })
    })

    it('partially synced, one finished, one infinite', () => {
      const result = mergeConfigurations(
        [saved('a', 100, null, 400), saved('b', 200, 300, 300)],
        [actual('a', 100, null), actual('b', 200, 300)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: EMPTY_DIFF,
        configurations: [
          { ...actual('a', 100, null), currentHeight: 400 },
          { ...actual('b', 200, 300), currentHeight: 300 },
        ],
        safeHeight: 300,
      })
    })

    it('both synced', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 400), saved('b', 200, 300, 300)],
        [actual('a', 100, 400), actual('b', 200, 300)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: EMPTY_DIFF,
        configurations: [
          { ...actual('a', 100, 400), currentHeight: 400 },
          { ...actual('b', 200, 300), currentHeight: 300 },
        ],
        safeHeight: 300,
      })
    })
  })

  describe('configuration changed', () => {
    it('single removed', () => {
      const result = mergeConfigurations(
        [saved('a', 100, null, 300), saved('b', 200, 400, 300)],
        [actual('b', 200, 400)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toDelete: ['a'],
          toRemoveData: [removal('a', 100, 300)],
        },
        configurations: [{ ...actual('b', 200, 400), currentHeight: 300 }],
        safeHeight: 300,
      })
    })

    it('maxHeight updated up', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 300, 300)],
        [actual('a', 100, 400)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toUpdate: [{ ...actual('a', 100, 400), currentHeight: 300 }],
        },
        configurations: [{ ...actual('a', 100, 400), currentHeight: 300 }],
        safeHeight: 300,
      })
    })

    it('maxHeight updated down', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 300, 300)],
        [actual('a', 100, 200)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toRemoveData: [removal('a', 201, 300)],
          toUpdate: [{ ...actual('a', 100, 200), currentHeight: 200 }],
        },
        configurations: [{ ...actual('a', 100, 200), currentHeight: 200 }],
        safeHeight: 200,
      })
    })

    it('maxHeight updated down, nothing to trim', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 300, 150)],
        [actual('a', 100, 200)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toUpdate: [{ ...actual('a', 100, 200), currentHeight: 150 }],
        },
        configurations: [{ ...actual('a', 100, 200), currentHeight: 150 }],
        safeHeight: 150,
      })
    })

    it('maxHeight removed', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 300, 300)],
        [actual('a', 100, null)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toUpdate: [{ ...actual('a', 100, null), currentHeight: 300 }],
        },
        configurations: [{ ...actual('a', 100, null), currentHeight: 300 }],
        safeHeight: 300,
      })
    })

    it('minHeight updated up', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 300)],
        [actual('a', 200, 400)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toRemoveData: [removal('a', 100, 199)],
          toUpdate: [{ ...actual('a', 200, 400), currentHeight: 300 }],
        },
        configurations: [{ ...actual('a', 200, 400), currentHeight: 300 }],
        safeHeight: 300,
      })
    })

    it('minHeight updated up after currentHeight', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 300)],
        [actual('a', 1000, null)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toRemoveData: [removal('a', 100, 999)],
          toUpdate: [{ ...actual('a', 1000, null), currentHeight: null }],
        },
        configurations: [{ ...actual('a', 1000, null), currentHeight: null }],
        safeHeight: 999,
      })
    })

    it('minHeight updated down', () => {
      const result = mergeConfigurations(
        [saved('a', 200, 400, 300)],
        [actual('a', 100, 400)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toRemoveData: [removal('a', 200, 300)],
          toUpdate: [{ ...actual('a', 100, 400), currentHeight: null }],
        },
        configurations: [{ ...actual('a', 100, 400), currentHeight: null }],
        safeHeight: 99,
      })
    })

    it('both min and max height updated', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 400)],
        [actual('a', 200, 300)],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toRemoveData: [removal('a', 100, 199), removal('a', 301, 400)],
          toUpdate: [{ ...actual('a', 200, 300), currentHeight: 300 }],
        },
        configurations: [{ ...actual('a', 200, 300), currentHeight: 300 }],
        safeHeight: 300,
      })
    })

    it('properties changed', () => {
      const result = mergeConfigurations(
        [saved('a', 100, 400, 300)],
        [{ ...actual('a', 100, 400), properties: 'new-props' }],
        SERIALIZE,
      )
      expect(result).toEqual({
        diff: {
          ...EMPTY_DIFF,
          toUpdate: [
            {
              ...actual('a', 100, 400),
              properties: 'new-props',
              currentHeight: 300,
            },
          ],
        },
        configurations: [
          {
            ...actual('a', 100, 400),
            properties: 'new-props',
            currentHeight: 300,
          },
        ],
        safeHeight: 300,
      })
    })
  })
})

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  properties?: string,
): Configuration<string> {
  return { id, properties: properties ?? '', minHeight, maxHeight }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
  properties?: string,
): SavedConfiguration<string> {
  return {
    id,
    properties: JSON.stringify(properties ?? ''),
    minHeight,
    maxHeight,
    currentHeight,
  }
}

function removal(id: string, from: number, to: number): RemovalConfiguration {
  return { id, from, to }
}
