import { expect, type MockObject, mockFn, mockObject } from 'earl'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import type { DiscoveryCache } from './provider/DiscoveryCache'

describe('OverwriteCacheWrapper', () => {
  let cacheMock: MockObject<DiscoveryCache>
  let wrapper: OverwriteCacheWrapper

  beforeEach(() => {
    cacheMock = mockObject<DiscoveryCache>({
      set: mockFn().resolvesTo(undefined),
      get: mockFn().resolvesTo('some value'),
    })
    wrapper = new OverwriteCacheWrapper(cacheMock)
  })

  describe('get method', () => {
    it('always returns undefined regardless of underlying cache value', async () => {
      const key = 'testKey'

      const result = await wrapper.get(key)

      expect(result).toEqual(undefined)
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

      cacheMock.set.given(key, value).rejectsWithOnce(error)

      await expect(wrapper.set(key, value)).toBeRejectedWith('Cache set failed')
    })
  })
})
