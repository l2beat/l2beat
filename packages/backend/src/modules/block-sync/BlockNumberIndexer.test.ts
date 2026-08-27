import { Logger } from '@l2beat/backend-tools'
import type { BlockHeader, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockObject } from 'earl'
import { BlockNumberIndexer } from './BlockNumberIndexer'

const START = UnixTime(1_700_000_000)
const BLOCK_TIME = 10
const DELAY = 300
const INTERVAL_MS = 10_000

describe(BlockNumberIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install({ now: START * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('finds the block at the delayed timestamp using only headers', async () => {
    const chain = fakeChain(1000)
    const indexer = createIndexer(chain)

    const result = await indexer.tick()

    // block 970 is exactly DELAY seconds old
    expect(result).toEqual(970)
    expect(chain.requested).toInclude('latest')
    expect(chain.requested.length).toBeLessThanOrEqual(12)
  })

  it('returns the latest block when it is already old enough', async () => {
    const chain = fakeChain(1000)
    const indexer = createIndexer(chain, 0)

    const result = await indexer.tick()

    expect(result).toEqual(1000)
    expect(chain.requested).toEqual(['latest'])
  })

  it('advances with a single call per tick once polled headers are old enough', async () => {
    const chain = fakeChain(1000)
    const indexer = createIndexer(chain)
    await indexer.tick()

    let previous = indexer.blockHeight
    let lastTickCalls = 0
    for (let i = 1; i <= DELAY / (INTERVAL_MS / 1000) + 1; i++) {
      time.tick(INTERVAL_MS)
      chain.latest = 1000 + i
      chain.requested.length = 0
      const result = await indexer.tick()
      expect(result).toBeGreaterThanOrEqual(previous)
      previous = result
      lastTickCalls = chain.requested.length
    }

    // block 1001 became DELAY seconds old on the last tick and was polled on the first
    expect(previous).toEqual(1001)
    expect(lastTickCalls).toEqual(1)
  })

  it('searches for the exact block when polls were missed', async () => {
    const chain = fakeChain(1000)
    const indexer = createIndexer(chain)
    await indexer.tick()

    time.tick(600_000)
    chain.latest = 1060
    const result = await indexer.tick()

    expect(result).toEqual(1030)
  })

  it('never lowers the height when the node reports a stale tip', async () => {
    const chain = fakeChain(1000)
    const indexer = createIndexer(chain)
    await indexer.tick()

    chain.latest = 990
    const result = await indexer.tick()

    expect(result).toEqual(970)
  })
})

function createIndexer(chain: FakeChain, delay = DELAY) {
  const blockProvider = mockObject<BlockProvider>({
    chain: 'ethereum',
    getBlockHeader: async (x) => chain.header(x),
  })
  return new BlockNumberIndexer(
    blockProvider,
    'ethereum',
    Logger.SILENT,
    delay,
    INTERVAL_MS,
  )
}

interface FakeChain {
  latest: number
  requested: (number | 'latest')[]
  header(x: number | 'latest'): BlockHeader
}

// Block 1000 is mined at START and every BLOCK_TIME seconds another one
function fakeChain(latest: number): FakeChain {
  return {
    latest,
    requested: [],
    header(x) {
      this.requested.push(x)
      const number = x === 'latest' ? this.latest : x
      return {
        number,
        hash: `0x${number}`,
        timestamp: START + (number - 1000) * BLOCK_TIME,
      }
    },
  }
}
