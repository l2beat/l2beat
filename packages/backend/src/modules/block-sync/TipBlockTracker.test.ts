import type { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { TipBlockTracker } from './TipBlockTracker'

const GENESIS = 1_700_000_000
const BLOCK_TIME = 2

function timestampOf(blockNumber: number) {
  return UnixTime(GENESIS + blockNumber * BLOCK_TIME)
}

function blockAt(timestamp: number) {
  return Math.floor((timestamp - GENESIS) / BLOCK_TIME)
}

function mockProvider(latestBlockNumber: () => number) {
  const getBlockTimestamp = mockFn(async (blockNumber: number) => {
    expect(blockNumber).toBeLessThanOrEqual(latestBlockNumber())
    return timestampOf(blockNumber)
  })
  return mockObject<BlockProvider>({
    chain: 'ethereum',
    getLatestBlockNumber: async () => latestBlockNumber(),
    getBlockTimestamp,
    getBlockNumberAtOrBefore: async (timestamp: UnixTime) =>
      Math.min(blockAt(timestamp), latestBlockNumber()),
  })
}

describe(TipBlockTracker.name, () => {
  it('returns the block at or before the target', async () => {
    let latest = 100_000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 0)

    const first = await tracker.getBlockNumberAtOrBefore(
      timestampOf(90_000) as UnixTime,
    )
    expect(first).toEqual(90_000)

    latest = 101_000
    const second = await tracker.getBlockNumberAtOrBefore(
      timestampOf(95_000) as UnixTime,
    )
    expect(second).toEqual(95_000)
  })

  it('never returns a block newer than the target', async () => {
    const latest = 100_000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 0)

    await tracker.getBlockNumberAtOrBefore(timestampOf(50_000) as UnixTime)

    for (let block = 50_010; block < 50_200; block += 7) {
      // land in between two blocks so the exact answer needs rounding down
      const target = UnixTime(timestampOf(block) + 1)
      const result = await tracker.getBlockNumberAtOrBefore(target)
      expect(timestampOf(result)).toBeLessThanOrEqual(target)
    }
  })

  it('spends at most one block lookup per tick once warmed up', async () => {
    const latest = 1_000_000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 0)

    await tracker.getBlockNumberAtOrBefore(timestampOf(500_000) as UnixTime)
    const afterBootstrap = provider.getBlockTimestamp.calls.length

    for (let tick = 1; tick <= 20; tick++) {
      await tracker.getBlockNumberAtOrBefore(
        timestampOf(500_000 + tick * 5) as UnixTime,
      )
    }

    const perTick =
      (provider.getBlockTimestamp.calls.length - afterBootstrap) / 20
    expect(perTick).toBeLessThanOrEqual(1)
  })

  it('skips the lookup entirely while the target stays within tolerance', async () => {
    const latest = 1_000_000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 60)

    const block = await tracker.getBlockNumberAtOrBefore(
      timestampOf(500_000) as UnixTime,
    )
    const afterBootstrap = provider.getBlockTimestamp.calls.length

    const result = await tracker.getBlockNumberAtOrBefore(
      UnixTime(timestampOf(500_000) + 30),
    )

    expect(result).toEqual(block)
    expect(provider.getBlockTimestamp.calls.length).toEqual(afterBootstrap)
  })

  it('recovers when the block time estimate overshoots', async () => {
    const latest = 1_000_000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 0)

    await tracker.getBlockNumberAtOrBefore(timestampOf(500_000) as UnixTime)
    // a huge jump makes the first extrapolation land far from the answer
    const result = await tracker.getBlockNumberAtOrBefore(
      timestampOf(900_000) as UnixTime,
    )

    expect(result).toBeGreaterThan(500_000)
    expect(timestampOf(result)).toBeLessThanOrEqual(timestampOf(900_000))
  })

  it('does not run past the chain tip', async () => {
    let latest = 1000
    const provider = mockProvider(() => latest)
    const tracker = new TipBlockTracker(provider, 0)

    await tracker.getBlockNumberAtOrBefore(timestampOf(900) as UnixTime)

    latest = 1000
    // target is far in the future, the tip must cap the answer
    const result = await tracker.getBlockNumberAtOrBefore(
      UnixTime(timestampOf(5000)),
    )
    expect(result).toEqual(1000)
  })
})
