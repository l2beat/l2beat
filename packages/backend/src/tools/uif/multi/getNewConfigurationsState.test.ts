import { expect } from 'earl'

import { getNewConfigurationsState } from './getNewConfigurationsState'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

const SERIALIZE = (v: unknown) => JSON.stringify(v)
const DIFF = { toAdd: [], toUpdate: [], toDelete: [], toTrim: [] }

describe(getNewConfigurationsState.name, () => {
  describe('errors', () => {
    it('duplicate config id', () => {
      expect(() =>
        getNewConfigurationsState(
          [actual('a', 100, null), actual('a', 200, 300)],
          SERIALIZE,
          [],
        ),
      ).toThrow(/a is duplicated/)
    })

    it('minHeight greater than maxHeight', () => {
      expect(() =>
        getNewConfigurationsState([actual('a', 200, 100)], SERIALIZE, []),
      ).toThrow(/a has minHeight greater than maxHeight/)
    })
  })

  describe('regular sync', () => {
    it('empty actual and saved', () => {
      const result = getNewConfigurationsState([], SERIALIZE, [])
      expect(result).toEqual({
        diff: DIFF,
        configurations: [],
      })
    })

    it('empty saved', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, null), actual('b', 200, 300)],
        SERIALIZE,
        [],
      )
      expect(result).toEqual({
        diff: {
          ...DIFF,
          toAdd: [actual('a', 100, null), actual('b', 200, 300)],
        },
        configurations: [
          saved('a', 100, null, null),
          saved('b', 200, 300, null),
        ],
      })
    })

    it('partially synced, both early', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 400), actual('b', 200, null)],
        SERIALIZE,
        [saved('a', 100, 400, 300), saved('b', 200, null, 300)],
      )
      expect(result).toEqual({
        diff: { ...DIFF },
        configurations: [
          { ...actual('a', 100, 400), currentHeight: 300 },
          { ...actual('b', 200, null), currentHeight: 300 },
        ],
      })
    })

    it('partially synced, one new not yet started', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 400), actual('b', 555, null)],
        SERIALIZE,
        [saved('a', 100, 400, 300), saved('b', 555, null, null)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [
          saved('a', 100, 400, 300),
          saved('b', 555, null, null),
        ],
      })
    })

    it('partially synced, one finished', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 555), actual('b', 200, 300)],
        SERIALIZE,
        [saved('a', 100, 555, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [saved('a', 100, 555, 400), saved('b', 200, 300, 300)],
      })
    })

    it('partially synced, one finished, one infinite', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, null), actual('b', 200, 300)],
        SERIALIZE,
        [saved('a', 100, null, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [saved('a', 100, null, 400), saved('b', 200, 300, 300)],
      })
    })

    it('both synced', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 400), actual('b', 200, 300)],
        SERIALIZE,
        [saved('a', 100, 400, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [saved('a', 100, 400, 400), saved('b', 200, 300, 300)],
      })
    })
  })

  describe('configuration changed', () => {
    it('empty actual', () => {
      const result = getNewConfigurationsState([], SERIALIZE, [
        saved('a', 100, 400, 300),
        saved('b', 200, null, 300),
      ])
      expect(result).toEqual({
        diff: [removal('a', 100, 300), removal('b', 200, 300)],
        configurations: [],
      })
    })

    it('single removed', () => {
      const result = getNewConfigurationsState(
        [actual('b', 200, 400)],
        SERIALIZE,
        [saved('a', 100, null, 300), saved('b', 200, 400, 300)],
      )
      expect(result).toEqual({
        diff: [removal('a', 100, 300)],
        configurations: [saved('b', 200, 400, 300)],
      })
    })

    it('maxHeight updated up', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 400)],
        SERIALIZE,
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [saved('a', 100, 400, 300)],
      })
    })

    it('maxHeight updated down', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 200)],
        SERIALIZE,
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        diff: [removal('a', 201, 300)],
        configurations: [saved('a', 100, 200, 200)],
      })
    })

    it('maxHeight removed', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, null)],
        SERIALIZE,
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        diff: DIFF,
        configurations: [saved('a', 100, null, 300)],
      })
    })

    it('minHeight updated up', () => {
      const result = getNewConfigurationsState(
        [actual('a', 200, 400)],
        SERIALIZE,
        [saved('a', 100, 400, 300)],
      )
      expect(result).toEqual({
        diff: [removal('a', 100, 199)],
        configurations: [saved('a', 200, 400, 300)],
      })
    })

    it('minHeight updated down', () => {
      const result = getNewConfigurationsState(
        [actual('a', 100, 400)],
        [saved('a', 200, 400, 300)],
      )
      expect(result).toEqual({
        diff: [removal('a', 200, 300)],
        configurations: [saved('a', 100, 400, null)],
      })
    })

    it('both min and max height updated', () => {
      const result = getNewConfigurationsState(
        [actual('a', 200, 300)],
        SERIALIZE,
        [saved('a', 100, 400, 400)],
      )
      expect(result).toEqual({
        diff: [removal('a', 100, 199), removal('a', 301, 400)],
        configurations: [saved('a', 200, 300, 300)],
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
