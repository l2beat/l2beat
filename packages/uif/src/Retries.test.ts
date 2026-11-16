import { expect } from 'earl'
import { Retries } from './Retries'

describe(Retries.withExpectedWait.name, () => {
  const notReady = new Error('not ready')
  const strategy = () =>
    Retries.withExpectedWait({
      isExpected: (error) => error === notReady,
      intervalMs: 60_000,
      otherwise: Retries.exponentialBackOff({
        initialTimeoutMs: 1000,
        maxAttempts: 2,
      }),
    })

  it('waits at the interval indefinitely', () => {
    const retries = strategy()
    for (let i = 0; i < 100; i++) retries.markAttempt(notReady)

    expect(retries.isWaiting?.()).toEqual(true)
    expect(retries.shouldRetry()).toEqual(true)
    expect(retries.timeoutMs()).toEqual(60_000)
    expect(retries.attempts()).toEqual(100)
  })

  it('keeps the back-off of other errors separate from waits', () => {
    const retries = strategy()
    for (let i = 0; i < 20; i++) retries.markAttempt(notReady)
    retries.markAttempt(new Error('RPC error'))

    expect(retries.isWaiting?.()).toEqual(false)
    expect(retries.timeoutMs()).toEqual(1000)
    expect(retries.attempts()).toEqual(1)
  })

  it('gives up on other errors as the inner strategy does', () => {
    const retries = strategy()
    for (let i = 0; i < 3; i++) retries.markAttempt(new Error('RPC error'))

    expect(retries.shouldRetry()).toEqual(false)
  })

  it('clears both counts', () => {
    const retries = strategy()
    retries.markAttempt(notReady)
    retries.markAttempt(new Error('RPC error'))
    retries.clear()

    expect(retries.isWaiting?.()).toEqual(false)
    expect(retries.attempts()).toEqual(0)
  })
})
