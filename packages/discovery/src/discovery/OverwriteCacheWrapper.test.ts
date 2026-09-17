import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import type { DiscoveryCache } from './provider/DiscoveryCache'

describe('OverwriteCacheWrapper', () => {
  let cacheMock: DiscoveryCache
  let wrapper: OverwriteCacheWrapper

  beforeEach(() => {
    cacheMock = {
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue('some value'),
    } as unknown as DiscoveryCache
    wrapper = new OverwriteCacheWrapper(cacheMock)
  })

  describe('get method', () => {
    it('always returns undefined regardless of underlying cache value', async () => {
      const key = 'testKey'

      const result = await wrapper.get(key)

      expect(result).toStrictEqual(undefined)
      // Verify that the underlying cache was not called
      expect(cacheMock.get).not.toHaveBeenCalled()
    })
  })

  describe('set method', () => {
    it('forwards set operations to the underlying cache', async () => {
      const key = 'testKey'
      const value = 'testValue'

      await wrapper.set(key, value)

      expect(cacheMock.set).toHaveBeenCalledWith(key, value)
    })

    it('propagates errors from the underlying cache', async () => {
      const key = 'testKey'
      const value = 'testValue'
      const error = new Error('Cache set failed')

      vi.mocked(cacheMock.set).mockRejectedValueOnce(error)

      await expect(wrapper.set(key, value)).rejects.toThrow('Cache set failed')
    })
  })
})
