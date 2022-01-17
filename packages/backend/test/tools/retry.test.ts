import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earljs'

import { retry } from '../../src/tools/retry'

describe('retry', () => {
  it('is transparent if call succeeds', async () => {
    const result = await retry(async () => 1, {
      minTimeout: 100,
      maxRetryCount: Infinity,
    })
    expect(result).toEqual(1)
  })

  it('will retry until successful', async () => {
    let callCount = 0
    let completed = false

    const clock = FakeTimers.install()
    async function call() {
      callCount++
      if (callCount < 5) {
        throw new Error('Not yet!')
      }
      return 1
    }
    retry(call, {
      minTimeout: 100,
      maxRetryCount: Infinity,
    }).then(() => {
      completed = true
    })

    await clock.runAllAsync()
    clock.uninstall()

    expect(clock.now).toEqual(100 + 200 + 400 + 800)
    expect(completed).toEqual(true)
    expect(callCount).toEqual(5)
  })

  it('will fail if not successful after maxRetryCount', async () => {
    let failed = false

    const clock = FakeTimers.install()
    async function call() {
      throw new Error('Na-ah!')
    }
    retry(call, {
      minTimeout: 100,
      maxRetryCount: 2,
    }).catch(() => {
      failed = true
    })

    await clock.runAllAsync()
    clock.uninstall()

    expect(clock.now).toEqual(100 + 200)
    expect(failed).toEqual(true)
  })

  it('applies maxTimeout', async () => {
    let callCount = 0

    const clock = FakeTimers.install()
    async function call() {
      callCount++
      if (callCount < 5) {
        throw new Error('Not yet!')
      }
      return 1
    }
    retry(call, {
      minTimeout: 100,
      maxTimeout: 300,
      maxRetryCount: Infinity,
    })

    await clock.runAllAsync()
    clock.uninstall()

    expect(clock.now).toEqual(100 + 200 + 300 + 300)
    expect(callCount).toEqual(5)
  })

  it('calls onError', async () => {
    let callCount = 0
    let errorCount = 0

    const clock = FakeTimers.install()
    async function call() {
      callCount++
      if (callCount < 5) {
        throw new Error('Not yet!')
      }
      return 1
    }
    async function onError(e: unknown) {
      expect(e).toBeA(Error)
      expect((e as any).message).toEqual('Not yet!')
      errorCount++
    }
    retry(call, {
      minTimeout: 100,
      maxRetryCount: Infinity,
      onError,
    })

    await clock.runAllAsync()
    clock.uninstall()

    expect(errorCount).toEqual(4)
  })

  it('handles code that throws in a sync way', async () => {
    let tries = 0
    const fn = () => {
      tries++
      throw new Error('oops')
    }
    const promise = retry(fn, {
      maxRetryCount: 4,
      minTimeout: 0,
      maxTimeout: 0,
    })
    await expect(promise).toBeRejected('oops')
    expect(tries).toEqual(5)
  })
})
