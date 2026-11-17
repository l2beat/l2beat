import { Logger } from '@l2beat/backend-tools'
import { NotFoundOnRpcError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import range from 'lodash/range'
import { ChainHeadIndexer } from './ChainHeadIndexer'
import { FakeChain, FakeChainBlocks } from './test/FakeChain'

/**
 * Methodology: each run plays a few hundred random steps against a fake
 * chain. A step is one of what real chains and RPCs do (new blocks, a shallow
 * reorg, a reorg past every remembered block, a node behind the load
 * balancer, a block named before it is served, a block served from another
 * fork, a restart of the process), followed by one tick of the head and by a
 * reader doing what UIF makes a child do: drop what it has above a lowered
 * height, then read up to the height.
 *
 * After every step the stored blocks must be one chain and the reader must
 * hold nothing the head stored differently. After the run, once the chain
 * has grown a little with no faults, both must hold exactly the chain.
 *
 * The runs are seeded, so a failure names the seed that replays it
 */
const CHAIN = 'base'
const BATCH_SIZE = 5
const STEPS = 300
const SEEDS = range(1, 41)

describe(`${ChainHeadIndexer.name} replay`, () => {
  for (const seed of SEEDS) {
    it(`keeps one chain and a consistent reader through a random run (seed ${seed})`, async () => {
      const random = mulberry32(seed)
      const pick = (from: number, to: number) =>
        from + Math.floor(random() * (to - from + 1))

      const chain = new FakeChain(1000, UnixTime.now() - 1000)
      const store = new FakeChainBlocks(CHAIN)
      const reader = new Reader()
      let head = newHead(chain, store)

      const step = async () => {
        let height: number
        try {
          height = (await head.follow()).height
        } catch (error) {
          // with nothing stored there is no height to hold: the tick is retried
          if (!(error instanceof NotFoundOnRpcError)) throw error
          return
        }
        await reader.follow(head, height, store.rows[0]?.number ?? height)
        expectOneChain(store)
        expectReaderAgrees(reader, store)
      }

      for (let i = 0; i < STEPS; i++) {
        const event = random()
        const tip = store.rows.at(-1)?.number ?? chain.latest
        if (event < 0.55) {
          chain.mine(pick(1, 6))
        } else if (event < 0.65) {
          const depth = pick(1, 8)
          chain.reorg(
            chain.latest - depth + 1,
            chain.latest - depth + pick(0, depth + 3),
          )
        } else if (event < 0.67) {
          const depth = pick(70, 90)
          chain.reorg(chain.latest - depth + 1, chain.latest + pick(0, 3))
        } else if (event < 0.77) {
          chain.lagOnce(pick(1, 3))
        } else if (event < 0.85) {
          chain.mine()
          chain.failToServeOnce(chain.latest)
        } else if (event < 0.92) {
          chain.mine(pick(1, 3))
          chain.serveFromForkOnce(pick(tip + 1, chain.latest))
        } else if (event < 0.96) {
          head = newHead(chain, store)
        }
        await step()
      }

      // a chain that keeps growing shows every fork left behind
      for (let i = 0; i < 40; i++) {
        if (i < 5) chain.mine()
        await step()
      }

      expect(store.rows.at(-1)?.number).toEqual(chain.latest)
      expect(store.hashes()).toEqual(
        store.numbers().map((number) => chain.hashOf(number)),
      )
      expect(reader.height).toEqual(chain.latest)
      expect([...reader.facts.entries()]).toEqual(
        [...reader.facts.keys()].map((number) => [
          number,
          chain.hashOf(number),
        ]),
      )
    })
  }
})

/** What a child derives from the blocks, reduced to which block it saw at each height */
class Reader {
  height = 0
  readonly facts = new Map<number, string>()

  async follow(head: ChainHeadIndexer, height: number, oldestStored: number) {
    if (height < this.height) {
      for (const number of this.facts.keys()) {
        if (number > height) this.facts.delete(number)
      }
      this.height = height
    }
    while (this.height < height) {
      // like a child that picks up where the head did after it restarted
      const from = Math.max(this.height + 1, oldestStored)
      const to = Math.min(from + BATCH_SIZE - 1, height)
      let blocks: Awaited<ReturnType<ChainHeadIndexer['getBlocks']>>
      try {
        blocks = await head.getBlocks(from, to)
      } catch {
        // a failed update is retried, here with the next step
        return
      }
      for (const block of blocks) this.facts.set(block.number, block.hash)
      this.height = to
    }
  }
}

/** Checked hundreds of times a run, so compared plainly and asserted only on a difference */
function expectOneChain(store: FakeChainBlocks) {
  for (let i = 1; i < store.rows.length; i++) {
    const [previous, block] = [store.rows[i - 1], store.rows[i]]
    if (
      block.number !== previous.number + 1 ||
      block.parentHash !== previous.hash
    ) {
      expect(block).toEqual({
        ...block,
        number: previous.number + 1,
        parentHash: previous.hash,
      })
    }
  }
}

function expectReaderAgrees(reader: Reader, store: FakeChainBlocks) {
  for (const block of store.rows) {
    const seen = reader.facts.get(block.number)
    if (seen !== undefined && seen !== block.hash) {
      expect({ number: block.number, hash: seen }).toEqual({
        number: block.number,
        hash: block.hash,
      })
    }
  }
}

function newHead(chain: FakeChain, store: FakeChainBlocks) {
  return new ChainHeadIndexer(
    {
      chain: CHAIN,
      source: chain,
      db: store.db,
      batchSize: BATCH_SIZE,
      keepFor: 4 * UnixTime.HOUR,
    },
    Logger.SILENT,
  )
}

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
