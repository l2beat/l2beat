import { expect, mockFn } from 'earl'
import { retry, withRetries } from './retries'

describe(retry.name, () => {
  it('retries up to maxAttempts 1', async () => {
    const fn = mockFn().rejectsWith(new Error('oops'))
    await retry(fn, {
      initialTimeoutMs: 1,
      maxTimeoutMs: 1,
      maxAttempts: 1,
    }).catch(() => 0)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries up to maxAttempts 10', async () => {
    const fn = mockFn().rejectsWith(new Error('oops'))
    await retry(fn, {
      initialTimeoutMs: 1,
      maxTimeoutMs: 1,
      maxAttempts: 10,
    }).catch(() => 0)
    expect(fn).toHaveBeenCalledTimes(10)
  })

  it('sleeps for correct times', async () => {
    const fn = mockFn().rejectsWith(new Error('oops'))
    const _setTimeout = globalThis.setTimeout
    const calls: number[] = []
    globalThis.setTimeout = ((cb: () => void, ms: number) => {
      calls.push(ms)
      cb()
    }) as unknown as typeof setTimeout
    await retry(fn, {
      initialTimeoutMs: 1,
      maxTimeoutMs: 100,
      maxAttempts: 10,
    }).catch(() => 0)
    globalThis.setTimeout = _setTimeout
    expect(fn).toHaveBeenCalledTimes(10)
    expect(calls).toEqual([1, 2, 4, 8, 16, 32, 64, 100, 100])
  })
})

describe(withRetries.name, () => {
  let flip = false
  class BarService {
    async getBar() {
      flip = !flip
      if (flip) throw new Error('flop')
      return 'bar'
    }
  }
  class FooService extends BarService {
    async getFoo() {
      flip = !flip
      if (flip) throw new Error('flop')
      return 'foo'
    }

    notAsync() {
      return 42
    }
  }

  it('wraps a given service', async () => {
    const fooService = withRetries(new FooService(), {
      initialTimeoutMs: 1,
      maxAttempts: 2,
    })
    expect(await fooService.getFoo()).toEqual('foo')
    expect(await fooService.getBar()).toEqual('bar')
    expect(fooService.notAsync()).toEqual(42)
    expect(fooService.toString()).toEqual('[object Object]')
  })
})
