import { expect } from 'earl'
import { AsyncMutex } from './AsyncMutex'

describe(AsyncMutex.name, () => {
  it('runs queued tasks one at a time', async () => {
    const mutex = new AsyncMutex()
    const first = deferred<void>()
    const calls: string[] = []

    const firstRun = mutex.runExclusive(async () => {
      calls.push('first:start')
      await first.promise
      calls.push('first:end')
    })

    const secondRun = mutex.runExclusive(async () => {
      calls.push('second:start')
      calls.push('second:end')
    })

    expect(calls).toEqual(['first:start'])

    first.resolve()
    await Promise.all([firstRun, secondRun])

    expect(calls).toEqual([
      'first:start',
      'first:end',
      'second:start',
      'second:end',
    ])
  })

  it('skips tryRunExclusive when busy', async () => {
    const mutex = new AsyncMutex()
    const first = deferred<void>()
    const calls: string[] = []

    const firstRun = mutex.runExclusive(async () => {
      calls.push('first:start')
      await first.promise
      calls.push('first:end')
    })

    const skipped = await mutex.tryRunExclusive(async () => {
      calls.push('second:start')
    })

    expect(skipped).toEqual(undefined)
    expect(calls).toEqual(['first:start'])

    first.resolve()
    await firstRun

    expect(calls).toEqual(['first:start', 'first:end'])
  })

  it('allows tryRunExclusive after the lock is released', async () => {
    const mutex = new AsyncMutex()
    const calls: string[] = []

    await mutex.runExclusive(async () => {
      calls.push('first')
    })

    const result = await mutex.tryRunExclusive(async () => {
      calls.push('second')
      return 'ok'
    })

    expect(result).toEqual('ok')
    expect(calls).toEqual(['first', 'second'])
  })
})

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}
