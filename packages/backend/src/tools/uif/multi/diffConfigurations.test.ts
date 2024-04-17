import { expect } from 'earl'

import { diffConfigurations } from './diffConfigurations'
import {
  Configuration,
  RemovalConfiguration,
  SavedConfiguration,
} from './types'

describe(diffConfigurations.name, () => {
  describe('errors', () => {
    it('duplicate config id', () => {
      expect(() =>
        diffConfigurations([actual('a', 100, null), actual('a', 200, 300)], []),
      ).toThrow(/a is duplicated/)
    })

    it('minHeight greater than maxHeight', () => {
      expect(() => diffConfigurations([actual('a', 200, 100)], [])).toThrow(
        /a has minHeight greater than maxHeight/,
      )
    })
  })

  describe('regular sync', () => {
    it('empty actual and stored', () => {
      const result = diffConfigurations([], [])
      expect(result).toEqual({ toRemove: [], toSave: [], safeHeight: Infinity })
    })

    it('empty stored', () => {
      const result = diffConfigurations(
        [actual('a', 100, null), actual('b', 200, 300)],
        [],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, null, null), saved('b', 200, 300, null)],
        safeHeight: 99,
      })
    })

    it('partially synced, both early', () => {
      const result = diffConfigurations(
        [actual('a', 100, 400), actual('b', 200, null)],
        [saved('a', 100, 400, 300), saved('b', 200, null, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, 400, 300), saved('b', 200, null, 300)],
        safeHeight: 300,
      })
    })

    it('partially synced, one new not yet started', () => {
      const result = diffConfigurations(
        [actual('a', 100, 400), actual('b', 555, null)],
        [saved('a', 100, 400, 300), saved('b', 555, null, null)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, 400, 300), saved('b', 555, null, null)],
        safeHeight: 300,
      })
    })

    it('partially synced, one finished', () => {
      const result = diffConfigurations(
        [actual('a', 100, 555), actual('b', 200, 300)],
        [saved('a', 100, 555, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, 555, 400), saved('b', 200, 300, 300)],
        safeHeight: 400,
      })
    })

    it('partially synced, one finished, one infinite', () => {
      const result = diffConfigurations(
        [actual('a', 100, null), actual('b', 200, 300)],
        [saved('a', 100, null, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, null, 400), saved('b', 200, 300, 300)],
        safeHeight: 400,
      })
    })

    it('both synced', () => {
      const result = diffConfigurations(
        [actual('a', 100, 400), actual('b', 200, 300)],
        [saved('a', 100, 400, 400), saved('b', 200, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, 400, 400), saved('b', 200, 300, 300)],
        safeHeight: Infinity,
      })
    })
  })

  describe('configuration changed', () => {
    it('empty actual', () => {
      const result = diffConfigurations(
        [],
        [saved('a', 100, 400, 300), saved('b', 200, null, 300)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 100, 300), removal('b', 200, 300)],
        toSave: [],
        safeHeight: Infinity,
      })
    })

    it('single removed', () => {
      const result = diffConfigurations(
        [actual('b', 200, 400)],
        [saved('a', 100, null, 300), saved('b', 200, 400, 300)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 100, 300)],
        toSave: [saved('b', 200, 400, 300)],
        safeHeight: 300,
      })
    })

    it('maxHeight updated up', () => {
      const result = diffConfigurations(
        [actual('a', 100, 400)],
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, 400, 300)],
        safeHeight: 300,
      })
    })

    it('maxHeight updated down', () => {
      const result = diffConfigurations(
        [actual('a', 100, 200)],
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 201, 300)],
        toSave: [saved('a', 100, 200, 200)],
        safeHeight: Infinity,
      })
    })

    it('maxHeight removed', () => {
      const result = diffConfigurations(
        [actual('a', 100, null)],
        [saved('a', 100, 300, 300)],
      )
      expect(result).toEqual({
        toRemove: [],
        toSave: [saved('a', 100, null, 300)],
        safeHeight: 300,
      })
    })

    it('minHeight updated up', () => {
      const result = diffConfigurations(
        [actual('a', 200, 400)],
        [saved('a', 100, 400, 300)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 100, 199)],
        toSave: [saved('a', 200, 400, 300)],
        safeHeight: 300,
      })
    })

    it('minHeight updated down', () => {
      const result = diffConfigurations(
        [actual('a', 100, 400)],
        [saved('a', 200, 400, 300)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 200, 300)],
        toSave: [saved('a', 100, 400, null)],
        safeHeight: 99,
      })
    })

    it('both min and max height updated', () => {
      const result = diffConfigurations(
        [actual('a', 200, 300)],
        [saved('a', 100, 400, 400)],
      )
      expect(result).toEqual({
        toRemove: [removal('a', 100, 199), removal('a', 301, 400)],
        toSave: [saved('a', 200, 300, 300)],
        safeHeight: Infinity,
      })
    })
  })
})

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<null> {
  return { id, properties: null, minHeight, maxHeight }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight: number | null,
): SavedConfiguration<null> {
  return { id, properties: null, minHeight, maxHeight, currentHeight }
}

function removal(
  id: string,
  from: number,
  to: number,
): RemovalConfiguration<null> {
  return { id, properties: null, from, to }
}
