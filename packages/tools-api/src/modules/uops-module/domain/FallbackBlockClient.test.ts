import { expect, mockFn, mockObject } from 'earl'
import type { BlockClient } from './ChainService'
import { FallbackBlockClient } from './FallbackBlockClient'

describe(FallbackBlockClient.name, () => {
  // Why: Alchemy goes first but has some networks disabled, and a dead
  // endpoint must not cost its retries on every block of a stats run.
  it('falls back to the next client and keeps using it', async () => {
    const dead = mockObject<BlockClient>({
      getLatestBlockNumber: mockFn().rejectsWith(new Error('disabled')),
    })
    const alive = mockObject<BlockClient>({
      getLatestBlockNumber: mockFn().resolvesTo(100),
    })
    const client = new FallbackBlockClient([dead, alive])

    expect(await client.getLatestBlockNumber()).toEqual(100)
    expect(await client.getLatestBlockNumber()).toEqual(100)

    expect(dead.getLatestBlockNumber).toHaveBeenCalledTimes(1)
    expect(alive.getLatestBlockNumber).toHaveBeenCalledTimes(2)
  })

  it('still reaches the fallback when a concurrent call switched to it', async () => {
    let failSlowCall: (error: Error) => void = () => {}
    const dead = mockObject<BlockClient>({
      getLatestBlockNumber: mockFn()
        .returnsOnce(
          new Promise<number>((_, reject) => {
            failSlowCall = reject
          }),
        )
        .rejectsWith(new Error('disabled')),
    })
    const alive = mockObject<BlockClient>({
      getLatestBlockNumber: mockFn().resolvesTo(100),
    })
    const client = new FallbackBlockClient([dead, alive])

    const slowCall = client.getLatestBlockNumber()
    expect(await client.getLatestBlockNumber()).toEqual(100)
    failSlowCall(new Error('disabled'))

    expect(await slowCall).toEqual(100)
  })

  it('throws the last error when every client fails', async () => {
    const client = new FallbackBlockClient([
      mockObject<BlockClient>({
        getLatestBlockNumber: mockFn().rejectsWith(new Error('first')),
      }),
      mockObject<BlockClient>({
        getLatestBlockNumber: mockFn().rejectsWith(new Error('second')),
      }),
    ])

    await expect(client.getLatestBlockNumber()).toBeRejectedWith('second')
  })
})
