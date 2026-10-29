import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { expect, mockFn } from 'earl'
import {
  type ExecutionDayRpc,
  getBuilderPayment,
  getDirectTransfers,
  getPriorityFees,
  readExecutionDay,
} from './ethereumExecutionDay'

const BUILDER = '0x1111111111111111111111111111111111111111'
const USER = '0x2222222222222222222222222222222222222222'
const OTHER = '0x3333333333333333333333333333333333333333'
const ETH = 10n ** 18n

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
      ),
    ).toEqual(3n)
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

describe(readExecutionDay.name, () => {
  it('sums the blocks and fetches receipts only without a builder payment', async () => {
    const rpc = {
      getBlockWithTransactions: mockFn(async (n: number) =>
        n === 101
          ? block([tx(USER, 1n)], [3_000_000_000n])
          : block([tx(BUILDER, ETH)], [1_000_000_000n]),
      ),
      getBlockReceipts: mockFn().resolvesTo([
        { gasUsed: 21_000n, effectiveGasPrice: 12n, logs: [] },
      ]),
    } as unknown as ExecutionDayRpc & {
      getBlockReceipts: ReturnType<typeof mockFn>
    }

    const day = await readExecutionDay(rpc, 100, 102)

    expect(day).toEqual({
      withdrawals: 5n * 10n ** 18n,
      executionRewards: 2n * ETH + 42_000n,
      blockCount: 3,
    })
    expect(rpc.getBlockReceipts).toHaveBeenOnlyCalledWith(101)
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
