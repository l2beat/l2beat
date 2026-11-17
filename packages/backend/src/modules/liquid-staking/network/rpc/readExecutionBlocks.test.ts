import { Logger } from '@l2beat/backend-tools'
import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  type ExecutionBlocksRpc,
  getBuilderPayment,
  getDirectTransfers,
  getPriorityFees,
  readExecutionBlocks,
} from './readExecutionBlocks'

const BUILDER = '0x1111111111111111111111111111111111111111'
const USER = '0x2222222222222222222222222222222222222222'
const OTHER = '0x3333333333333333333333333333333333333333'
const ETH = 10n ** 18n
const DAY = UnixTime.fromDate(new Date('2026-11-13T00:00:00Z'))

describe(getBuilderPayment.name, () => {
  it('is the last transaction when the fee recipient sent it', () => {
    expect(
      getBuilderPayment(block([tx(USER, 5n), tx(BUILDER.toUpperCase(), ETH)])),
    ).toEqual(ETH)
  })

  it('adds the earlier payments to the same proposer', () => {
    expect(
      getBuilderPayment(
        block([tx(BUILDER, 2n), tx(BUILDER, 3n, OTHER), tx(BUILDER, ETH)]),
      ),
    ).toEqual(ETH + 2n)
  })

  it('is absent when someone else sent the last transaction', () => {
    expect(getBuilderPayment(block([tx(BUILDER, ETH), tx(USER, ETH)]))).toEqual(
      undefined,
    )
  })

  it('is absent when the fee recipient sent no value', () => {
    expect(getBuilderPayment(block([tx(BUILDER, 0n)]))).toEqual(undefined)
  })
})

describe(getDirectTransfers.name, () => {
  it('sums ETH others send to the fee recipient', () => {
    expect(
      getDirectTransfers(
        block([tx(USER, 3n, BUILDER), tx(USER, 5n), tx(BUILDER, 7n, BUILDER)]),
        [{ status: 1 }, { status: 1 }, { status: 1 }],
      ),
    ).toEqual(3n)
  })

  it('skips reverted transactions, which move no ETH', () => {
    expect(
      getDirectTransfers(
        block([tx(USER, 3n, BUILDER), tx(OTHER, 5n, BUILDER)]),
        [{ status: 0 }, { status: 1 }],
      ),
    ).toEqual(5n)
  })

  it('fails on a receipt without status', () => {
    expect(() =>
      getDirectTransfers(block([tx(USER, 3n, BUILDER)]), [{}]),
    ).toThrow('Receipt without status')
  })
})

describe(getPriorityFees.name, () => {
  it('sums what each transaction paid above the base fee', () => {
    expect(
      getPriorityFees(10n, [
        { gasUsed: 21_000n, effectiveGasPrice: 12n },
        { gasUsed: 100_000n, effectiveGasPrice: 10n },
      ]),
    ).toEqual(42_000n)
  })
})

describe(readExecutionBlocks.name, () => {
  it('sums the blocks and fetches receipts only without a builder payment', async () => {
    const rpc = mockObject<ExecutionBlocksRpc>({
      getBlockWithTransactions: async (n) =>
        n === 101
          ? block([tx(USER, 1n), tx(OTHER, 4n, BUILDER)], [3_000_000_000n])
          : block([tx(BUILDER, ETH)], [1_000_000_000n]),
      getBlockReceipts: mockFn().resolvesTo([
        { gasUsed: 21_000n, effectiveGasPrice: 12n, status: 1, logs: [] },
        { gasUsed: 21_000n, effectiveGasPrice: 10n, status: 1, logs: [] },
      ]),
    })

    const sums = await readExecutionBlocks(
      rpc,
      Logger.SILENT,
      DAY,
      [100, 101, 205],
    )

    expect(sums).toEqual({
      withdrawals: 5n * 10n ** 18n,
      builderPayments: 2n * ETH,
      priorityFees: 42_000n,
      directTransfers: 4n,
      blockCount: 3,
      builderBlockCount: 2,
    })
    expect(rpc.getBlockReceipts).toHaveBeenOnlyCalledWith(101)
  })

  it('fails on a block without a fee recipient', async () => {
    const rpc = mockObject<ExecutionBlocksRpc>({
      getBlockWithTransactions: async () => ({
        ...block([tx(USER, 1n)]),
        miner: undefined,
      }),
    })

    await expect(
      readExecutionBlocks(rpc, Logger.SILENT, DAY, [100]),
    ).toBeRejectedWith('Block without a fee recipient')
  })
})

function block(
  transactions: EVMBlockWithTransactions['transactions'],
  withdrawalsGwei: bigint[] = [],
): EVMBlockWithTransactions {
  return {
    timestamp: 0,
    hash: '0x',
    parentHash: '0x',
    logsBloom: '0x',
    number: 0,
    miner: BUILDER,
    baseFeePerGas: 10n,
    withdrawals: withdrawalsGwei.map((amount) => ({ amount })),
    transactions,
  }
}

function tx(
  from: string,
  value: bigint,
  to = USER,
): EVMBlockWithTransactions['transactions'][number] {
  return {
    hash: '0x',
    from,
    to,
    value,
    data: undefined,
    type: '2',
    calls: undefined,
    blobVersionedHashes: undefined,
    blockNumber: 0,
  }
}
