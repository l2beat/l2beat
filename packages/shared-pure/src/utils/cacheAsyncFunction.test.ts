import { expect, mockFn } from 'earl'
import { cacheAsyncFunction } from './cacheAsyncFunction'

describe(cacheAsyncFunction.name, () => {
  it('only calls the function once', async () => {
    const fn = mockFn(() => Promise.resolve(42))
    const { call } = cacheAsyncFunction(fn)
    expect(fn).not.toHaveBeenCalled()
    await call()
    expect(fn).toHaveBeenCalledTimes(1)
    await call()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('performs a single call in case of many simultaneous calls', async () => {
    const fn = mockFn(() => Promise.resolve(42))
    const { call } = cacheAsyncFunction(fn)

    const result = await Promise.all([call(), call(), call()])

    expect(result).toEqual([42, 42, 42])
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('allows for re-fetching', async () => {
    let counter = 0
    const fn = mockFn(() => Promise.resolve(counter++))
    const { call, refetch } = cacheAsyncFunction(fn)

    expect(await call()).toEqual(0)

    await refetch()

    expect(await call()).toEqual(1)
  })

  it('re-fetching also only calls once', async () => {
    let counter = 0
    const fn = mockFn(() => Promise.resolve(counter++))
    const { call, refetch } = cacheAsyncFunction(fn)

    expect(await call()).toEqual(0)

    const result = await Promise.all([refetch(), call(), call()])
    expect(result).toEqual([undefined, 1, 1])

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
