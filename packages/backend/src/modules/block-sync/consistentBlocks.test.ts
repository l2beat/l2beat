import type { Block, Log } from '@l2beat/shared-pure'
import { expect, type MockFunction, mockFn } from 'earl'
import { type ConsistencyInput, onlyConsistent } from './consistentBlocks'
import { computeLogsBloom, EMPTY_LOGS_BLOOM } from './logsBloom'

const FULL_LOGS_BLOOM = `0x${'1'.repeat(512)}`
const TX = { hash: '0xtx' }

type ConfirmNoLogs = MockFunction<[Block], Promise<boolean>>

describe(onlyConsistent.name, () => {
  describe('synchronous execution', () => {
    it('handles the case where everything works', async () => {
      const block1 = makeBlock(1, { logsBloom: FULL_LOGS_BLOOM })
      const block2 = makeBlock(2, { logsBloom: EMPTY_LOGS_BLOOM })
      const block3 = makeBlock(3, { logsBloom: FULL_LOGS_BLOOM })
      const logA = makeLog(block1, '0xa')
      const logB = makeLog(block3, '0xb')
      const logC = makeLog(block3, '0xc')

      const { result, confirmNoLogs } = await run({
        blocks: [block1, block2, block3],
        logs: [logA, logB, logC],
      })

      expect(result).toEqual([
        { block: block1, logs: [logA] },
        { block: block2, logs: [] },
        { block: block3, logs: [logB, logC] },
      ])
      expect(confirmNoLogs).not.toHaveBeenCalled()
    })

    it('stops at a reorged block', async () => {
      const block1 = makeBlock(1, { logsBloom: FULL_LOGS_BLOOM })
      const block2 = makeBlock(2, { logsBloom: EMPTY_LOGS_BLOOM })
      const block3 = makeBlock(3, { logsBloom: FULL_LOGS_BLOOM })
      const logA = makeLog(block1, '0xa')
      // logs of the block that used to be at height 3
      const logB = { ...makeLog(block3, '0xb'), blockHash: '0xold' }

      const { result } = await run({
        blocks: [block1, block2, block3],
        logs: [logA, logB],
      })

      expect(result).toEqual([
        { block: block1, logs: [logA] },
        { block: block2, logs: [] },
      ])
    })

    it('stops at a block whose logs are missing', async () => {
      const block1 = makeBlock(1, { logsBloom: FULL_LOGS_BLOOM })
      const block2 = makeBlock(2, { logsBloom: EMPTY_LOGS_BLOOM })
      const block3 = makeBlock(3, { logsBloom: FULL_LOGS_BLOOM })
      const logA = makeLog(block1, '0xa')

      const { result, confirmNoLogs } = await run({
        blocks: [block1, block2, block3],
        logs: [logA],
      })

      expect(result).toEqual([
        { block: block1, logs: [logA] },
        { block: block2, logs: [] },
      ])
      expect(confirmNoLogs).not.toHaveBeenCalled()
    })
  })

  describe('asynchronous execution', () => {
    // Blocks 10-14 settle with a lag. Block 13 settles 9-11 and block 14
    // settles 12, so only blocks 13 and 14 are left unsettled in the batch.
    //
    //   block  settledHeight  own logs  transactions
    //   9      (before batch) C
    //   10     8              A         -
    //   11     8              -         TX
    //   12     8              -         TX
    //   13     11             B         -
    //   14     12             -         TX
    function settledBatch() {
      const block10 = makeBlock(10, { settledHeight: 8 })
      const block11 = makeBlock(11, { settledHeight: 8, transactions: [TX] })
      const block12 = makeBlock(12, { settledHeight: 8, transactions: [TX] })
      const block13 = makeBlock(13, { settledHeight: 11 })
      const block14 = makeBlock(14, { settledHeight: 12, transactions: [TX] })
      const logC = {
        ...makeLog(block10, '0xc'),
        blockNumber: 9,
        blockHash: '0x9',
      }
      const logA = makeLog(block10, '0xa')
      const logB = makeLog(block13, '0xb')
      block13.logsBloom = computeLogsBloom([logC, logA])
      block14.logsBloom = EMPTY_LOGS_BLOOM
      return {
        blocks: [block10, block11, block12, block13, block14],
        logs: [logC, logA, logB],
      }
    }

    it('trusts logs matched by hash whatever the bloom says', async () => {
      const block = makeBlock(1, {
        settledHeight: 0,
        logsBloom: EMPTY_LOGS_BLOOM,
        transactions: [TX],
      })
      const logA = makeLog(block, '0xa')

      const { result, confirmNoLogs } = await run({
        blocks: [block],
        logs: [logA],
      })

      expect(result).toEqual([{ block, logs: [logA] }])
      expect(confirmNoLogs).not.toHaveBeenCalled()
    })

    it('accepts a block without transactions whatever the bloom says', async () => {
      const block = makeBlock(1, { settledHeight: 0 })

      const { result, confirmNoLogs } = await run({ blocks: [block], logs: [] })

      expect(result).toEqual([{ block, logs: [] }])
      expect(confirmNoLogs).not.toHaveBeenCalled()
    })

    it('proves blocks without logs through the settled ranges', async () => {
      const { blocks, logs } = settledBatch()

      const { result, confirmNoLogs } = await run({
        blocks,
        logs,
        logsFromBlock: 9,
      })

      expect(result.map((r) => r.block.number)).toEqual([10, 11, 12, 13, 14])
      // Only the unsettled block 14 needs its receipts.
      expect(confirmNoLogs).toHaveBeenOnlyCalledWith(blocks[4])
    })

    it('falls back to receipts when a settled range starts before the fetched logs', async () => {
      const { blocks, logs } = settledBatch()

      const { result, confirmNoLogs } = await run({
        blocks,
        logs,
        logsFromBlock: 10,
      })

      expect(result.map((r) => r.block.number)).toEqual([10, 11, 12, 13, 14])
      expect(confirmNoLogs).toHaveBeenCalledTimes(2)
      expect(confirmNoLogs).toHaveBeenNthCalledWith(1, blocks[1])
      expect(confirmNoLogs).toHaveBeenNthCalledWith(2, blocks[4])
    })

    it('falls back to receipts when the rebuilt bloom does not match', async () => {
      const { blocks, logs } = settledBatch()
      blocks[3].logsBloom = FULL_LOGS_BLOOM

      const { result, confirmNoLogs } = await run({
        blocks,
        logs,
        logsFromBlock: 9,
        confirmNoLogs:
          mockFn<ConsistencyInput['confirmNoLogs']>().resolvesToOnce(false),
      })

      expect(result.map((r) => r.block.number)).toEqual([10])
      expect(confirmNoLogs).toHaveBeenOnlyCalledWith(blocks[1])
    })
  })
})

async function run(input: {
  blocks: Block[]
  logs: Log[]
  logsFromBlock?: number
  confirmNoLogs?: ConfirmNoLogs
}) {
  const confirmNoLogs: ConfirmNoLogs =
    input.confirmNoLogs ??
    mockFn<ConsistencyInput['confirmNoLogs']>().resolvesTo(true)
  const result = await onlyConsistent({
    blocks: input.blocks,
    logs: input.logs,
    logsFromBlock: input.logsFromBlock ?? input.blocks[0].number,
    confirmNoLogs,
  })
  return { result, confirmNoLogs }
}

function makeBlock(
  number: number,
  options: Partial<Pick<Block, 'logsBloom' | 'settledHeight' | 'transactions'>>,
): Block {
  return {
    number,
    hash: `0x${number}`,
    // A bloom that vouches for nothing unless the test says otherwise.
    logsBloom: FULL_LOGS_BLOOM,
    timestamp: number * 1_000,
    transactions: [],
    ...options,
  }
}

function makeLog(block: Block, data: string): Log {
  return {
    address: `0xaddress${data}`,
    topics: [`0xtopic${data}`],
    data,
    blockNumber: block.number,
    blockHash: block.hash,
    transactionHash: TX.hash,
    logIndex: 0,
  }
}
