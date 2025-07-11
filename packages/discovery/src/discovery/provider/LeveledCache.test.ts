import { expect, type MockObject, mockFn, mockObject } from 'earl'
import type { DiscoveryCache } from './DiscoveryCache'
import { LeveledCache } from './LeveledCache'

describe('LeveledCache', () => {
  let l1Mock: MockObject<DiscoveryCache>
  let l2Mock: MockObject<DiscoveryCache>
  let leveledCache: LeveledCache

  beforeEach(() => {
    l1Mock = mockObject<DiscoveryCache>({
      set: mockFn().resolvesTo(undefined),
      get: mockFn().resolvesTo(undefined),
    })
    l2Mock = mockObject<DiscoveryCache>({
      set: mockFn().resolvesTo(undefined),
      get: mockFn().resolvesTo(undefined),
    })

    // Instantiate LeveledCache with mocked l1 and l2
    leveledCache = new LeveledCache(l1Mock, l2Mock)
  })

  describe('set method', () => {
    it('should set the key-value pair in both l1 and l2 caches', async () => {
      const key = 'testKey'
      const value = 'testValue'

      await leveledCache.set(key, value)

      expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      expect(l2Mock.set).toHaveBeenCalledWith(key, value)
    })

    it('should handle set operations when one cache succeeds and the other fails', async () => {
      const key = 'testKey'
      const value = 'testValue'

      l2Mock.set.throws(new Error('L2 set failed'))

      // Since set awaits both operations, it should reject if any operation fails
      await expect(leveledCache.set(key, value)).toBeRejectedWith(
        'L2 set failed',
      )

      // Ensure set was called on both caches
      expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      expect(l2Mock.set).toHaveBeenCalledWith(key, value)
    })
  })

  describe('get method', () => {
    const key = 'testKey'
    const value = 'testValue'

    describe('Scenario 1: Key Exists in L1', () => {
      it('should return the value from l1 without querying l2', async () => {
        // Mock l1.get to return the value
        l1Mock.get.given(key).resolvesToOnce(value)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).not.toHaveBeenCalled()
        expect(result).toEqual(value)
      })
    })

    describe("Scenario 2: Key Doesn't Exist in L1 but Exists in L2", () => {
      it('should retrieve the value from l2, set it in l1, and return the value', async () => {
        // Mock l1.get to return undefined
        l1Mock.get.given(key).resolvesToOnce(undefined)

        // Mock l2.get to return the value
        l2Mock.get.given(key).resolvesToOnce(value)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).toHaveBeenCalledWith(key)
        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
        expect(result).toEqual(value)
      })

      it('should handle set in l1 if l2.get succeeds', async () => {
        l1Mock.get.given(key).resolvesToOnce(undefined)
        l2Mock.get.given(key).resolvesToOnce(value)

        await leveledCache.get(key)

        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      })
    })

    describe("Scenario 3: Key Doesn't Exist in Both L1 and L2", () => {
      it('should return undefined when the key is not found in both caches', async () => {
        // Mock both l1.get and l2.get to return undefined
        l1Mock.get.given(key).resolvesToOnce(undefined)
        l2Mock.get.given(key).resolvesToOnce(undefined)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).toHaveBeenCalledWith(key)
        expect(l1Mock.set).not.toHaveBeenCalled()
        expect(result).toEqual(undefined)
      })
    })

    describe('Error Handling', () => {
      it('should propagate errors from l1.get', async () => {
        const error = new Error('L1 get failed')
        l1Mock.get.given(key).rejectsWithOnce(error)

        await expect(leveledCache.get(key)).toBeRejectedWith('L1 get failed')

        // Ensure l2.get was NOT called since l1.get failed
        expect(l2Mock.get).not.toHaveBeenCalled()
      })

      it('should propagate errors from l2.get', async () => {
        l1Mock.get.given(key).resolvesToOnce(undefined)
        const error = new Error('L2 get failed')
        l2Mock.get.given(key).rejectsWithOnce(error)

        await expect(leveledCache.get(key)).toBeRejectedWith('L2 get failed')

        // Ensure l1.set was NOT called since l2.get failed
        expect(l2Mock.set).not.toHaveBeenCalled()
      })

      it('should propagate errors from l1.set during cache warming', async () => {
        l1Mock.get.given(key).resolvesToOnce(undefined)
        l2Mock.get.given(key).resolvesToOnce(value)
        l1Mock.set.given(key, value).rejectsWithOnce(new Error('L1 set failed'))

        await expect(leveledCache.get(key)).toBeRejectedWith('L1 set failed')

        // Ensure l1.set was attempted
        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      })
    })
  })
})
