import { Logger } from '@l2beat/backend-tools'
import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { ExecutionDayDune } from './dune/readDuneExecutionDay'
import { readExecutionDay } from './executionDay'
import type { ExecutionBlocksRpc } from './rpc/readExecutionBlocks'

const DAY = UnixTime.fromDate(new Date('2026-11-13T00:00:00Z'))
const BUILDER = '0x1111111111111111111111111111111111111111'
const PROPOSER = '0x2222222222222222222222222222222222222222'

describe(readExecutionDay.name, () => {
  it('reads only what Dune is missing over RPC, and adds it', async () => {
    const dune = mockDune({ blocks: 2, missing_blocks: [101] })
    const rpc = mockObject<ExecutionBlocksRpc>({
      getBlockWithTransactions: async () => builderBlock(5n, [7n]),
      getBlockReceipts: mockFn(),
    })

    const day = await readExecutionDay(dune, rpc, Logger.SILENT, DAY, 100, 102)

    expect(day).toEqual({
      withdrawals: 17n * 10n ** 9n,
      builderPayments: 15n,
      priorityFees: 3n,
      directTransfers: 4n,
      blockCount: 3,
      builderBlockCount: 2,
    })
    expect(rpc.getBlockWithTransactions).toHaveBeenOnlyCalledWith(101)
  })
})

function mockDune(change: object) {
  return mockObject<ExecutionDayDune>({
    query: async (_sql, _performance, schema) =>
      schema.parse([
        {
          builder_blocks: 1,
          large_builder_payment_blocks: null,
          builder_payments: '10',
          priority_fees: '3',
          direct_transfers: '4',
          withdrawals_gwei: '10',
          ...change,
        },
      ]),
  })
}

function builderBlock(
  payment: bigint,
  withdrawalsGwei: bigint[],
): EVMBlockWithTransactions {
  return {
    timestamp: 0,
    hash: '0x',
    parentHash: '0x',
    logsBloom: '0x',
    number: 0,
    gasUsed: 0,
    miner: BUILDER,
    baseFeePerGas: 10n,
    withdrawals: withdrawalsGwei.map((amount) => ({ amount })),
    transactions: [
      {
        hash: '0x',
        from: BUILDER,
        to: PROPOSER,
        value: payment,
        data: undefined,
        type: '2',
        calls: undefined,
        blobVersionedHashes: undefined,
        blockNumber: 0,
      },
    ],
  }
}
