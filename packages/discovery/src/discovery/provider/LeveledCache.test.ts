import { type MockObject, mockObject } from '@l2beat/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DiscoveryCache } from './DiscoveryCache'
import { LeveledCache } from './LeveledCache'

describe('LeveledCache', () => {
  let l1Mock: MockObject<DiscoveryCache>
  let l2Mock: MockObject<DiscoveryCache>
  let leveledCache: LeveledCache

  beforeEach(() => {
    l1Mock = mockObject<DiscoveryCache>({
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(undefined),
    })
    l2Mock = mockObject<DiscoveryCache>({
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(undefined),
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

      l2Mock.set.mockImplementation(() => {
        throw new Error('L2 set failed')
      })

      // Since set awaits both operations, it should reject if any operation fails
      await expect(leveledCache.set(key, value)).rejects.toThrow(
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
        l1Mock.get.mockResolvedValueOnce(value)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).not.toHaveBeenCalled()
        expect(result).toStrictEqual(value)
      })
    })

    describe("Scenario 2: Key Doesn't Exist in L1 but Exists in L2", () => {
      it('should retrieve the value from l2, set it in l1, and return the value', async () => {
        // Mock l1.get to return undefined
        l1Mock.get.mockResolvedValueOnce(undefined)

        // Mock l2.get to return the value
        l2Mock.get.mockResolvedValueOnce(value)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).toHaveBeenCalledWith(key)
        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
        expect(result).toStrictEqual(value)
      })

      it('should handle set in l1 if l2.get succeeds', async () => {
        l1Mock.get.mockResolvedValueOnce(undefined)
        l2Mock.get.mockResolvedValueOnce(value)

        await leveledCache.get(key)

        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      })
    })

    describe("Scenario 3: Key Doesn't Exist in Both L1 and L2", () => {
      it('should return undefined when the key is not found in both caches', async () => {
        // Mock both l1.get and l2.get to return undefined
        l1Mock.get.mockResolvedValueOnce(undefined)
        l2Mock.get.mockResolvedValueOnce(undefined)

        const result = await leveledCache.get(key)

        // Assertions
        expect(l1Mock.get).toHaveBeenCalledWith(key)
        expect(l2Mock.get).toHaveBeenCalledWith(key)
        expect(l1Mock.set).not.toHaveBeenCalled()
        expect(result).toStrictEqual(undefined)
      })
    })

    describe('Error Handling', () => {
      it('should propagate errors from l1.get', async () => {
        const error = new Error('L1 get failed')
        l1Mock.get.mockRejectedValueOnce(error)

        await expect(leveledCache.get(key)).rejects.toThrow('L1 get failed')

        // Ensure l2.get was NOT called since l1.get failed
        expect(l2Mock.get).not.toHaveBeenCalled()
      })

      it('should propagate errors from l2.get', async () => {
        l1Mock.get.mockResolvedValueOnce(undefined)
        const error = new Error('L2 get failed')
        l2Mock.get.mockRejectedValueOnce(error)

        await expect(leveledCache.get(key)).rejects.toThrow('L2 get failed')

        // Ensure l1.set was NOT called since l2.get failed
        expect(l2Mock.set).not.toHaveBeenCalled()
      })

      it('should propagate errors from l1.set during cache warming', async () => {
        l1Mock.get.mockResolvedValueOnce(undefined)
        l2Mock.get.mockResolvedValueOnce(value)
        l1Mock.set.mockRejectedValueOnce(new Error('L1 set failed'))

        await expect(leveledCache.get(key)).rejects.toThrow('L1 set failed')

        // Ensure l1.set was attempted
        expect(l1Mock.set).toHaveBeenCalledWith(key, value)
      })
    })
  })
})
