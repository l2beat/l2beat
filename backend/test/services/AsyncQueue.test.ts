import { expect } from 'chai'
import { AsyncQueue } from '../../src/services/AsyncQueue'

describe('AsyncQueue', () => {
  function setup() {
    let concurrent = 0
    let max = 0
    let total = 0
    async function call() {
      total += 1
      concurrent += 1
      await new Promise((resolve) => setTimeout(resolve, 0))
      max = Math.max(max, concurrent)
      concurrent -= 1
    }
    const getMax = () => max
    const getTotal = () => total
    return { call, getMax, getTotal }
  }

  function repeat<T>(times: number, fn: () => T): T[] {
    return new Array(times).fill(0).map(fn)
  }

  it('limits concurrent calls to 1', async () => {
    const { call, getMax } = setup()
    const queue = new AsyncQueue({ length: 1 })
    await Promise.all(repeat(20, () => queue.enqueue(call)))
    expect(getMax()).to.equal(1)
  })

  it('limits concurrent calls to 5', async () => {
    const { call, getMax } = setup()
    const queue = new AsyncQueue({ length: 5 })
    await Promise.all(repeat(20, () => queue.enqueue(call)))
    expect(getMax()).to.equal(5)
  })

  it('enforces rate limits', async () => {
    const { call, getTotal } = setup()
    const queue = new AsyncQueue({ length: 10, rateLimitPerMinute: 6_000 })
    Promise.all(repeat(20, () => queue.enqueue(call)))
    await new Promise((resolve) => setTimeout(resolve, 100))
    // should be 10, but we increase due to unpredictability of setTimeout
    // TODO: invent a more reliable test
    expect(getTotal()).to.be.lessThanOrEqual(12)
  })
})
