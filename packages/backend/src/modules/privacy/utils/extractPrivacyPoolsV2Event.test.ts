import type { IRpcClient, ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import {
  isPrivacyPoolsV2RelayedTransfer,
  isPrivacyPoolsV2Reshield,
  privacyPoolsV2RelayInterface,
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
const PROCESSOR = EthereumAddress('0x4444444444444444444444444444444444444444')
const ASSET = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')

describe(isPrivacyPoolsV2RelayedTransfer.name, () => {
  it('tells a relayed transfer from a withdrawal its processor reports', async () => {
    const transfer = transacted(VAULT, RELAYER, 0)
    const withdrawal = transacted(VAULT, PROCESSOR, 1)
    const relayed = receiptLog(
      PROCESSOR,
      privacyPoolsV2RelayInterface.encodeEventLog(
        privacyPoolsV2RelayInterface.getEvent('Relayed'),
        [ASSET, RELAYER, 690n, RELAYER, 10n, 0n],
      ),
      2,
    )
    const context = contextWith([transfer, withdrawal, relayed])

    expect(
      await isPrivacyPoolsV2RelayedTransfer(toLog(transfer), context),
    ).toEqual(true)
    expect(
      await isPrivacyPoolsV2RelayedTransfer(toLog(withdrawal), context),
    ).toEqual(false)
  })

  it('reads no receipt for a deposit', async () => {
    const rpc = mockObject<IRpcClient>({})
    const context = { rpc, receipts: new ReceiptLogCache(rpc) }

    expect(
      await isPrivacyPoolsV2RelayedTransfer(
        toLog(deposited(VAULT, 0)),
        context,
      ),
    ).toEqual(false)
  })
})

describe(isPrivacyPoolsV2Reshield.name, () => {
  it('flags a deposit sent with a withdrawal from the same vault', async () => {
    const deposit = deposited(VAULT, 1)
    const context = contextWith([transacted(VAULT, PROCESSOR, 0), deposit])

    expect(await isPrivacyPoolsV2Reshield(toLog(deposit), context)).toEqual(
      true,
    )
  })

  it('keeps a deposit sent with a withdrawal from another vault', async () => {
    const deposit = deposited(VAULT, 1)
    const context = contextWith([
      transacted(OTHER_VAULT, PROCESSOR, 0),
      deposit,
    ])

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

function contextWith(logs: ReceiptLog[]) {
  const rpc = mockObject<IRpcClient>({
    getTransactionReceipt: mockFn<
      IRpcClient['getTransactionReceipt']
    >().resolvesTo({ logs }),
  })
  return { rpc, receipts: new ReceiptLogCache(rpc) }
}

function toLog(log: ReceiptLog): Log {
  return {
    ...log,
    blockNumber: 100,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash: `0x${'bb'.repeat(32)}`,
  }
}
