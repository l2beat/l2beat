import { expect } from 'earl'
import { JqFilterError, JqRunner, JqTimeoutError, runJq } from './JqRunner'

/**
 * These tests use a real worker on purpose: the property under test is that a
 * synchronous wasm loop can be killed from the outside, which no mock proves.
 */
describe(JqRunner.name, () => {
  const runner = new JqRunner()
  after(() => runner.close())

  it('returns the single output of a filter as a parsed value', async () => {
    const result = await runner.run('.a + 1', { a: 41 }, { timeoutMs: 5000 })
    expect(result).toEqual(42)
  })

  it('kills a filter that never finishes and reports the timeout', async () => {
    const timeoutMs = 300
    const start = Date.now()
    await expect(
      runner.run('last(repeat(.))', 1, { timeoutMs }),
    ).toBeRejectedWith(JqTimeoutError, `${timeoutMs}ms`)
    // Well under the seconds an unbounded loop would otherwise take, with
    // slack for the worker to be torn down.
    expect(Date.now() - start).toBeLessThan(timeoutMs + 1500)
  })

  it('recovers after a timeout by starting a fresh worker', async () => {
    await expect(
      runner.run('last(repeat(.))', 1, { timeoutMs: 100 }),
    ).toBeRejectedWith(JqTimeoutError)
    expect(await runner.run('.x', { x: 'ok' }, { timeoutMs: 5000 })).toEqual(
      'ok',
    )
  })

  it('only fails the filter that timed out, not the one queued behind it', async () => {
    const stuck = runner.run('last(repeat(.))', 1, { timeoutMs: 100 })
    const queued = runner.run('. * 2', 21, { timeoutMs: 5000 })
    await expect(stuck).toBeRejectedWith(JqTimeoutError)
    expect(await queued).toEqual(42)
  })

  it('rejects a filter that produces no value or more than one', async () => {
    await expect(runner.run('empty', 1, { timeoutMs: 5000 })).toBeRejectedWith(
      JqFilterError,
      'exactly one value, got 0',
    )
    await expect(
      runner.run('.[]', [1, 2], { timeoutMs: 5000 }),
    ).toBeRejectedWith(JqFilterError, 'exactly one value, got 2')
  })

  it('surfaces jq compile and runtime errors with jq’s own message', async () => {
    await expect(runner.run('.[', 1, { timeoutMs: 5000 })).toBeRejectedWith(
      JqFilterError,
      'syntax error',
    )
    await expect(
      runner.run('error("boom")', 1, { timeoutMs: 5000 }),
    ).toBeRejectedWith(JqFilterError, 'boom')
  })

  it('rejects input that JSON cannot express instead of confusing jq', async () => {
    await expect(runner.run('.', 1n, { timeoutMs: 5000 })).toBeRejectedWith(
      'BigInt',
    )
    await expect(
      runner.run('.', undefined, { timeoutMs: 5000 }),
    ).toBeRejectedWith('JSON-serialisable')
  })

  it('rejects a non-positive timeout because it could never fire', async () => {
    await expect(runner.run('.', 1, { timeoutMs: 0 })).toBeRejectedWith(
      'timeoutMs must be positive',
    )
  })

  it('keeps large integers exact when they arrive as JSON text', async () => {
    const big = '123345893409584392323164'
    expect(await runner.run('.', big, { timeoutMs: 5000 })).toEqual(big)
  })
})

describe(runJq.name, () => {
  it('runs on a shared runner so callers need no lifecycle management', async () => {
    expect(await runJq('length', [1, 2, 3], { timeoutMs: 5000 })).toEqual(3)
  })
})
