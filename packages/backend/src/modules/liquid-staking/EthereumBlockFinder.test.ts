import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { EthereumBlockFinder } from './EthereumBlockFinder'

const START = UnixTime(1_704_067_200)
const FIRST_BLOCK = 18_908_895

describe(EthereumBlockFinder.name, () => {
  it('asks the provider once, then finds later hours over RPC', async () => {
    // Every 7th slot is missed
    const chain = makeChain(1_000, (slot) => slot % 7 !== 3)
    const provider = mockFn(async (timestamp: UnixTime) =>
      chain.blockAtOrBefore(timestamp),
    )
    const finder = makeFinder(chain, provider)

    for (let t = START; t <= START + 3 * UnixTime.HOUR; t += UnixTime.HOUR) {
      expect(
        await finder.getBlockNumberAtOrBefore(UnixTime(t), 'ethereum'),
      ).toEqual(chain.blockAtOrBefore(UnixTime(t)))
    }
    expect(provider).toHaveBeenCalledTimes(1)
  })

  it('looks a timestamp up once for every caller', async () => {
    const chain = makeChain(1_000, () => true)
    const provider = mockFn(async (timestamp: UnixTime) =>
      chain.blockAtOrBefore(timestamp),
    )
    const finder = makeFinder(chain, provider)

    const [a, b] = await Promise.all([
      finder.getBlockNumberAtOrBefore(START, 'ethereum'),
      finder.getBlockNumberAtOrBefore(START, 'ethereum'),
    ])

    expect(a).toEqual(b)
    expect(provider).toHaveBeenCalledTimes(1)
  })

  it('asks the provider when the bound passes the head', async () => {
    const chain = makeChain(310, () => true)
    const provider = mockFn(async (timestamp: UnixTime) =>
      chain.blockAtOrBefore(timestamp),
    )
    const finder = makeFinder(chain, provider)

    await finder.getBlockNumberAtOrBefore(START, 'ethereum')
    const next = UnixTime(START + UnixTime.HOUR)

    expect(await finder.getBlockNumberAtOrBefore(next, 'ethereum')).toEqual(
      chain.blockAtOrBefore(next),
    )
    expect(provider).toHaveBeenCalledTimes(2)
  })

  it('asks the provider when blocks come faster than slots', async () => {
    const chain = makeChain(1_000, () => true, 6)
    const provider = mockFn(async (timestamp: UnixTime) =>
      chain.blockAtOrBefore(timestamp),
    )
    const finder = makeFinder(chain, provider)

    await finder.getBlockNumberAtOrBefore(START, 'ethereum')
    const next = UnixTime(START + UnixTime.HOUR)

    expect(await finder.getBlockNumberAtOrBefore(next, 'ethereum')).toEqual(
      chain.blockAtOrBefore(next),
    )
    expect(provider).toHaveBeenCalledTimes(2)
  })
})

function makeFinder(
  chain: ReturnType<typeof makeChain>,
  provider: (timestamp: UnixTime) => Promise<number>,
) {
  return new EthereumBlockFinder({
    rpc: { getBlockHeader: chain.getBlockHeader },
    blockTimestampProvider: { getBlockNumberAtOrBefore: provider },
  })
}

/** Blocks from FIRST_BLOCK, one per kept slot, starting 10 slots before START. */
function makeChain(
  slots: number,
  keep: (slot: number) => boolean,
  slotSeconds = 12,
) {
  const timestamps: number[] = []
  for (let slot = 0; slot < slots; slot++) {
    if (keep(slot)) timestamps.push(START - 10 * 12 + slot * slotSeconds)
  }
  return {
    getBlockHeader: async (number: number | 'latest') => {
      const timestamp =
        typeof number === 'number'
          ? timestamps[number - FIRST_BLOCK]
          : undefined
      if (timestamp === undefined) throw new Error('No such block')
      return { number, timestamp } as never
    },
    blockAtOrBefore: (timestamp: UnixTime) =>
      FIRST_BLOCK + timestamps.filter((t) => t <= timestamp).length - 1,
  }
}
