import { install, InstalledClock } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earljs'

import { Logger } from '../../src'
import { promiseAllPlus } from '../../src/tools/promiseAllPlus'

describe(promiseAllPlus.name, () => {
  let time: InstalledClock
  beforeEach(() => {
    time = install({})
  })
  afterEach(() => {
    time.uninstall()
  })

  it('returns results in expected order', async () => {
    const resultsPromise = promiseAllPlus(
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
    const resultsPromise = promiseAllPlus(fns, Logger.SILENT, {
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

  it('retries failed fns', async () => {
    const mock = mockFn()
      .rejectsWithOnce(new Error())
      .rejectsWithOnce(new Error())
      .resolvesToOnce(1)
    const resultsPromise = promiseAllPlus([mock], Logger.SILENT)

    await time.runAllAsync()
    const results = await resultsPromise

    expect(results).toEqual([1])
    // called 3 times in total - retried 2 times and finally succeeded
    expect(mock).toHaveBeenCalledExactlyWith([[], [], []])
  })

  it('propagates permanent errors', async () => {
    const errorMessage = 'permanent error'
    const mock = mockFn().rejectsWith(new Error(errorMessage))
    const resultsPromise = promiseAllPlus([mock], Logger.SILENT)

    await time.runAllAsync()

    await expect(resultsPromise).toBeRejected(errorMessage)
  })
})

// note: sinon doesnt work with promisified style functions from timers/promises so we roll out our own
async function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}
