import type { EVMBlockWithTransactions } from '@l2beat/shared'
import { expect, mockFn } from 'earl'
import { utils } from 'ethers'
import {
  decodeDepositAmount,
  type ExecutionDayRpc,
  getBuilderPayment,
  getDirectTransfers,
  getPriorityFees,
  readExecutionDay,
} from './ethereumExecutionDay'

const BUILDER = '0x1111111111111111111111111111111111111111'
const USER = '0x2222222222222222222222222222222222222222'
const ETH = 10n ** 18n

describe(getBuilderPayment.name, () => {
  it('is the last transaction when the fee recipient sent it', () => {
    expect(
      getBuilderPayment(block([tx(USER, 5n), tx(BUILDER.toUpperCase(), ETH)])),
    ).toEqual(ETH)
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

describe(decodeDepositAmount.name, () => {
  it('reads the little-endian gwei amount as wei', () => {
    expect(decodeDepositAmount(depositLog(32_000_000_000n))).toEqual(32n * ETH)
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
      getLogs: mockFn().resolvesTo([
        { ...depositLog(32_000_000_000n), address: '', blockNumber: 101 },
      ]),
    } as unknown as ExecutionDayRpc & {
      getBlockReceipts: ReturnType<typeof mockFn>
      getLogs: ReturnType<typeof mockFn>
    }

    const day = await readExecutionDay(rpc, 100, 102)

    expect(day).toEqual({
      withdrawals: 5n * 10n ** 18n,
      deposits: 32n * ETH,
      executionRewards: 2n * ETH + 42_000n,
      blockCount: 3,
    })
    expect(rpc.getBlockReceipts).toHaveBeenOnlyCalledWith(101)
    expect(rpc.getLogs).toHaveBeenCalledTimes(1)
    expect(rpc.getLogs.calls[0]?.args.slice(0, 2)).toEqual([100, 102])
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

function depositLog(gwei: bigint) {
  const iface = new utils.Interface([
    'event DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index)',
  ])
  const amount = Buffer.alloc(8)
  amount.writeBigUInt64LE(gwei)
  return iface.encodeEventLog(iface.getEvent('DepositEvent'), [
    `0x${'11'.repeat(48)}`,
    `0x${'22'.repeat(32)}`,
    `0x${amount.toString('hex')}`,
    `0x${'33'.repeat(96)}`,
    `0x${'00'.repeat(8)}`,
  ])
}
