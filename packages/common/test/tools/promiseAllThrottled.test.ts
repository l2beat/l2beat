import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earljs'

import { Logger } from '../../src'
import { promiseAllThrottled } from '../../src/tools/promiseAllThrottled'

describe(promiseAllThrottled.name, () => {
  let time: InstalledClock
  beforeEach(() => {
    time = install({})
  })
  afterEach(() => {
    time.uninstall()
  })

  it('returns results in expected order', async () => {
    const resultsPromise = promiseAllThrottled(
      [
        async () => {
          await delay(3000)
          return 1
        },
        async () => {
          await delay(2000)
          return 2
        },
        async () => {
          await delay(1000)
          return 3
        },
      ],
      Logger.SILENT,
    )

    await time.tickAsync(3001)
    const results = await resultsPromise

    expect(results).toEqual([1, 2, 3])
  })

  it('works with limited concurrency', async () => {
    const fns = [
      mockFn(async () => {
        await delay(1000)
        return 1
      }),
      mockFn(async () => {
        await delay(2000)
        return 2
      }),
      mockFn(async () => {
        await delay(3000)
        return 3
      }),
    ]
    const resultsPromise = promiseAllThrottled(fns, Logger.SILENT, {
      maxConcurrency: 2,
    })

    await time.tickAsync(1000)
    expect(fns[0]).toHaveBeenCalledExactlyWith([[]])
    expect(fns[1]).toHaveBeenCalledExactlyWith([[]])
    expect(fns[2]).toHaveBeenCalledExactlyWith([])
    // note: as soon as first task is done, second is picked = maximum concurrency
    await time.tickAsync(1)
    expect(fns[0]).toHaveBeenCalledExactlyWith([[]])
    expect(fns[1]).toHaveBeenCalledExactlyWith([[]])
    expect(fns[2]).toHaveBeenCalledExactlyWith([[]])
    await time.tickAsync(3001)

    const results = await resultsPromise

    expect(results).toEqual([1, 2, 3])
  })

  it('retries failed fns')
})

// note: sinon doesnt work with promisified style functions from timers/promises so we roll out our own
async function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}
