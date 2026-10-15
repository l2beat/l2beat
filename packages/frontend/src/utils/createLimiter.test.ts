import { expect } from 'earl'
import { createLimiter } from './createLimiter'

describe(createLimiter.name, () => {
  it('runs at most the limit at once', async () => {
    const limit = createLimiter(2)
    let running = 0
    let maxRunning = 0
    const task = async (value: number) => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await new Promise((resolve) => setTimeout(resolve, 1))
      running--
      return value
    }

    const results = await Promise.all(
      [1, 2, 3, 4, 5].map((value) => limit(() => task(value))),
    )

    expect(results).toEqual([1, 2, 3, 4, 5])
    expect(maxRunning).toEqual(2)
  })

  it('frees the slot when a call fails', async () => {
    const limit = createLimiter(1)

    await expect(
      limit(() => Promise.reject(new Error('failed'))),
    ).toBeRejectedWith('failed')
    expect(await limit(async () => 'next')).toEqual('next')
  })
})
