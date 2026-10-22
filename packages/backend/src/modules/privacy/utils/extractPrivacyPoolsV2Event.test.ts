import type { IRpcClient, ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import {
  adjustPrivacyPoolsV2Flow,
  getPrivacyPoolsV2Withdrawal,
  isPrivacyPoolsV2Reshield,
  privacyPoolsV2ProcessorInterface,
} from './extractPrivacyPoolsV2Event'
import { ReceiptLogCache } from './ReceiptLogCache'

const vaultInterface = new utils.Interface([
  'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
])

const VAULT = EthereumAddress('0x1111111111111111111111111111111111111111')
const OTHER_VAULT = EthereumAddress(
  '0x5555555555555555555555555555555555555555',
)
const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')
const RECIPIENT = EthereumAddress('0x3333333333333333333333333333333333333333')
const PROCESSOR = EthereumAddress('0x4444444444444444444444444444444444444444')
const ACCOUNT = EthereumAddress('0x6666666666666666666666666666666666666666')
const ASSET = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const TRANSACTION_HASH = `0x${'bb'.repeat(32)}`

describe(getPrivacyPoolsV2Withdrawal.name, () => {
  it('drops a transact its sender calls and keeps one a processor pays out', async () => {
    const transfer = transacted(VAULT, RELAYER, 0)
    const withdrawal = transacted(VAULT, PROCESSOR, 1)
    const payout = relayed(2)
    const context = contextWith([transfer, withdrawal, payout], RELAYER)

    expect(await getPrivacyPoolsV2Withdrawal(toLog(transfer), context)).toEqual(
      undefined,
    )
    expect(
      await getPrivacyPoolsV2Withdrawal(toLog(withdrawal), context),
    ).toEqual({ sender: RELAYER, payout, paysOut: true })
  })

  it('pays out a batch once, with its last transact', async () => {
    const first = transacted(VAULT, PROCESSOR, 0)
    const last = transacted(VAULT, PROCESSOR, 1)
    const payout = relayed(2)
    const context = contextWith([first, last, payout], RELAYER)

    expect(await getPrivacyPoolsV2Withdrawal(toLog(first), context)).toEqual({
      sender: RELAYER,
      payout: undefined,
      paysOut: false,
    })
    expect(await getPrivacyPoolsV2Withdrawal(toLog(last), context)).toEqual({
      sender: RELAYER,
      payout,
      paysOut: true,
    })
  })

  it('keeps a caller that reports no payout, paying out once per transaction', async () => {
    const first = transacted(VAULT, ACCOUNT, 0)
    const other = transacted(VAULT, PROCESSOR, 1)
    const last = transacted(VAULT, ACCOUNT, 2)
    const context = contextWith([first, other, last], RELAYER)

    expect(await getPrivacyPoolsV2Withdrawal(toLog(first), context)).toEqual({
      sender: RELAYER,
      payout: undefined,
      paysOut: false,
    })
    expect(await getPrivacyPoolsV2Withdrawal(toLog(last), context)).toEqual({
      sender: RELAYER,
      payout: undefined,
      paysOut: true,
    })
  })

  it('reads no transaction for a deposit', async () => {
    const rpc = mockObject<IRpcClient>({})
    const context = { rpc, receipts: new ReceiptLogCache(rpc) }

    expect(
      await getPrivacyPoolsV2Withdrawal(toLog(deposited(VAULT, 0)), context),
    ).toEqual(undefined)
  })
})

describe(adjustPrivacyPoolsV2Flow.name, () => {
  it('keeps the value of every withdrawal and counts each payout once', async () => {
    const transfer = transacted(VAULT, RELAYER, 0)
    const first = transacted(VAULT, PROCESSOR, 1)
    const last = transacted(VAULT, PROCESSOR, 2)
    const context = contextWith([transfer, first, last, relayed(3)], RELAYER)
    const result = { count: 1, amount: 700n }

    expect(
      await adjustPrivacyPoolsV2Flow(toLog(transfer), result, context),
    ).toEqual(undefined)
    expect(
      await adjustPrivacyPoolsV2Flow(toLog(first), result, context),
    ).toEqual({ count: 0, amount: 700n })
    expect(
      await adjustPrivacyPoolsV2Flow(toLog(last), result, context),
    ).toEqual({ count: 1, amount: 700n })
  })

  it('passes other events through', async () => {
    const rpc = mockObject<IRpcClient>({})
    const context = { rpc, receipts: new ReceiptLogCache(rpc) }
    const result = { count: 1, amount: 500n }

    expect(
      await adjustPrivacyPoolsV2Flow(
        toLog(deposited(VAULT, 0)),
        result,
        context,
      ),
    ).toEqual(result)
  })
})

describe(isPrivacyPoolsV2Reshield.name, () => {
  it('flags a deposit sent with a withdrawal from the same vault', async () => {
    const deposit = deposited(VAULT, 1)
    const context = contextWith(
      [transacted(VAULT, PROCESSOR, 0), deposit],
      RELAYER,
    )

    expect(await isPrivacyPoolsV2Reshield(toLog(deposit), context)).toEqual(
      true,
    )
  })

  it('keeps a deposit sent with a withdrawal from another vault', async () => {
    const deposit = deposited(VAULT, 1)
    const context = contextWith(
      [transacted(OTHER_VAULT, PROCESSOR, 0), deposit],
      RELAYER,
    )

    expect(await isPrivacyPoolsV2Reshield(toLog(deposit), context)).toEqual(
      false,
    )
  })
})

function transacted(
  vault: EthereumAddress,
  caller: EthereumAddress,
  logIndex: number,
): ReceiptLog {
  return receiptLog(
    vault,
    vaultInterface.encodeEventLog(vaultInterface.getEvent('Transacted'), [
      [1, 2],
      [3],
      ASSET,
      700n,
      caller,
    ]),
    logIndex,
  )
}

function relayed(logIndex: number): ReceiptLog {
  return receiptLog(
    PROCESSOR,
    privacyPoolsV2ProcessorInterface.encodeEventLog(
      privacyPoolsV2ProcessorInterface.getEvent('Relayed'),
      [ASSET, RECIPIENT, 690n, RELAYER, 10n, 0n],
    ),
    logIndex,
  )
}

function deposited(vault: EthereumAddress, logIndex: number): ReceiptLog {
  return receiptLog(
    vault,
    vaultInterface.encodeEventLog(vaultInterface.getEvent('Deposited'), [
      1,
      ASSET,
      500n,
      PROCESSOR,
    ]),
    logIndex,
  )
}

function receiptLog(
  address: EthereumAddress,
  encoded: { data: string; topics: string[] },
  logIndex: number,
): ReceiptLog {
  return { address: address.toString(), ...encoded, logIndex }
}

function contextWith(logs: ReceiptLog[], sender: EthereumAddress) {
  const rpc = mockObject<IRpcClient>({
    getTransactionReceipt: mockFn<
      IRpcClient['getTransactionReceipt']
    >().resolvesTo({ logs }),
    getTransaction: mockFn<IRpcClient['getTransaction']>().resolvesTo({
      hash: TRANSACTION_HASH,
      value: undefined,
      from: sender.toString(),
      to: undefined,
      data: undefined,
      type: undefined,
      calls: undefined,
      blobVersionedHashes: undefined,
      blockNumber: 100,
    }),
  })
  return { rpc, receipts: new ReceiptLogCache(rpc) }
}

function toLog(log: ReceiptLog): Log {
  return {
    ...log,
    blockNumber: 100,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash: TRANSACTION_HASH,
  }
}
