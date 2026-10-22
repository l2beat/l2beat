import type { IRpcClient, ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import type { PrivacyRelayerActivityIndexerConfig } from '../types'
import { WITHDRAWAL_RELAYER_PARAMS } from '../zkmoney/test/fixtures'
import {
  extractPrivacyRelayerActivity,
  getPrivacyRelayerExtractor,
} from './extractPrivacyRelayerActivity'
import { ReceiptLogCache } from './ReceiptLogCache'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const privacyPoolsV2VaultInterface = new utils.Interface([
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
])

const privacyPoolsV2ProcessorInterface = new utils.Interface([
  'event Relayed(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding)',
  'event RelayedBatch(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding, uint256 _count)',
  'event WithdrawnToUnderlying(address indexed _asset, address indexed _underlying, address indexed _recipient, uint256 _sharesOut, uint256 _underlyingToRecipient, address _feeRecipient, uint256 _feeShares, uint256 _underlyingFee, uint256 _gasFunding)',
  'event Executed(address indexed inputToken, address indexed outputToken, uint256 inputAmount, address feeRecipient, uint256 feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

const CONTRACT = EthereumAddress('0x1111111111111111111111111111111111111111')
const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')
const RECIPIENT = EthereumAddress('0x3333333333333333333333333333333333333333')
const ASSET = EthereumAddress('0x4444444444444444444444444444444444444444')
const PROCESSOR = EthereumAddress('0x5555555555555555555555555555555555555555')
const ACCOUNT = EthereumAddress('0x6666666666666666666666666666666666666666')
const SENDER = EthereumAddress('0x7777777777777777777777777777777777777777')
const TRANSACTION_HASH = `0x${'bb'.repeat(32)}`

describe(extractPrivacyRelayerActivity.name, () => {
  it('derives event topics from the extractor definitions', () => {
    expect(
      getPrivacyRelayerExtractor({ extractor: 'privacyPoolsWithdrawalRelayed' })
        .event,
    ).toEqual(privacyPoolsInterface.getEventTopic('WithdrawalRelayed'))
    expect(
      getPrivacyRelayerExtractor({ extractor: 'tornadoCashWithdrawal' }).event,
    ).toEqual(tornadoCashInterface.getEventTopic('Withdrawal'))
  })

  it('derives the zk.money withdrawal topic hardcoded in the project config', () => {
    expect(
      getPrivacyRelayerExtractor({
        extractor: 'zkMoneyWithdrawalRelayer',
        params: WITHDRAWAL_RELAYER_PARAMS,
      }).event,
    ).toEqual(
      '0x0ef2e2e9f18042ca214d1bee833209f28326ffa8f4a6b0dc92172caf71bc5433',
    )
  })

  it('extracts Privacy Pools relayer', async () => {
    const log = encodeLog(privacyPoolsInterface, 'WithdrawalRelayed', [
      RELAYER,
      RECIPIENT,
      EthereumAddress('0x4444444444444444444444444444444444444444'),
      1_000n,
      10n,
    ])

    const result = await extractPrivacyRelayerActivity(
      config('privacyPoolsWithdrawalRelayed'),
      log,
      context(),
    )

    expect(result).toEqual({
      relayerAddress: RELAYER,
    })
  })

  it('extracts the Privacy Pools v2 fee recipient of each paid payout', async () => {
    for (const payout of [
      processorLog('Relayed', [ASSET, RECIPIENT, 1_000n, RELAYER, 10n, 0n]),
      processorLog('RelayedBatch', [
        ASSET,
        RECIPIENT,
        3_000n,
        RELAYER,
        30n,
        0n,
        3n,
      ]),
      processorLog('WithdrawnToUnderlying', [
        ASSET,
        ASSET,
        RECIPIENT,
        1_000n,
        990n,
        RELAYER,
        10n,
        10n,
        0n,
      ]),
      processorLog('Executed', [ASSET, ASSET, 1_000n, RELAYER, 10n]),
    ]) {
      expect(await extractPrivacyPoolsV2Relayer(PROCESSOR, [payout])).toEqual({
        relayerAddress: RELAYER,
      })
    }
  })

  it('ignores a Privacy Pools v2 self-relay, which names the caller with no fee', async () => {
    for (const payout of [
      processorLog('Relayed', [ASSET, RECIPIENT, 1_000n, RELAYER, 0n, 0n]),
      processorLog('RelayedBatch', [
        ASSET,
        RECIPIENT,
        3_000n,
        RELAYER,
        0n,
        0n,
        3n,
      ]),
      processorLog('WithdrawnToUnderlying', [
        ASSET,
        ASSET,
        RECIPIENT,
        1_000n,
        1_000n,
        RELAYER,
        0n,
        0n,
        0n,
      ]),
      processorLog('Executed', [ASSET, ASSET, 1_000n, RELAYER, 0n]),
    ]) {
      expect(await extractPrivacyPoolsV2Relayer(PROCESSOR, [payout])).toEqual(
        undefined,
      )
    }
  })

  it('ignores a Privacy Pools v2 withdrawal whose fee goes to its recipient', async () => {
    const payout = processorLog('Relayed', [
      ASSET,
      RECIPIENT,
      1_000n,
      RECIPIENT,
      10n,
      0n,
    ])
    expect(await extractPrivacyPoolsV2Relayer(PROCESSOR, [payout])).toEqual(
      undefined,
    )
  })

  it('names the sender of a Privacy Pools v2 withdrawal its caller reports no payout for', async () => {
    expect(await extractPrivacyPoolsV2Relayer(ACCOUNT, [])).toEqual({
      relayerAddress: SENDER,
    })
  })

  it('ignores a Privacy Pools v2 transfer, whose relayer calls the vault itself', async () => {
    expect(await extractPrivacyPoolsV2Relayer(SENDER, [])).toEqual(undefined)
  })

  it('extracts Tornado Cash relayer', async () => {
    const log = encodeLog(tornadoCashInterface, 'Withdrawal', [
      RECIPIENT,
      `0x${'11'.repeat(32)}`,
      RELAYER,
      10n,
    ])

    const result = await extractPrivacyRelayerActivity(
      config('tornadoCashWithdrawal'),
      log,
      context(),
    )

    expect(result).toEqual({
      relayerAddress: RELAYER,
    })
  })

  it('ignores a withdrawal submitted by its recipient', async () => {
    const log = encodeLog(privacyPoolsInterface, 'WithdrawalRelayed', [
      RECIPIENT,
      RECIPIENT,
      EthereumAddress('0x4444444444444444444444444444444444444444'),
      1_000n,
      0n,
    ])

    const result = await extractPrivacyRelayerActivity(
      config('privacyPoolsWithdrawalRelayed'),
      log,
      context(),
    )

    expect(result).toEqual(undefined)
  })

  it('ignores a Tornado Cash self-withdrawal with the zero relayer address', async () => {
    const log = encodeLog(tornadoCashInterface, 'Withdrawal', [
      RECIPIENT,
      `0x${'11'.repeat(32)}`,
      EthereumAddress.ZERO,
      0n,
    ])

    const result = await extractPrivacyRelayerActivity(
      config('tornadoCashWithdrawal'),
      log,
      context(),
    )

    expect(result).toEqual(undefined)
  })
})

function config(
  extractor:
    | 'privacyPoolsWithdrawalRelayed'
    | 'privacyPoolsV2Withdrawal'
    | 'tornadoCashWithdrawal',
): PrivacyRelayerActivityIndexerConfig {
  return {
    id: 'test-id',
    projectId: 'test-project',
    chain: 'ethereum',
    address: CONTRACT,
    sinceTimestamp: UnixTime(0),
    event: getPrivacyRelayerExtractor({ extractor }).event,
    extractor,
  }
}

/** Event-based extractors never touch the RPC. */
function context() {
  const rpc = mockObject<IRpcClient>({})
  return { rpc, receipts: new ReceiptLogCache(rpc) }
}

function encodeLog(
  iface: utils.Interface,
  eventName: string,
  args: unknown[],
): Log {
  const encoded = iface.encodeEventLog(eventName, args)
  return {
    address: CONTRACT.toString(),
    data: encoded.data,
    topics: encoded.topics,
    blockNumber: 100,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash: `0x${'bb'.repeat(32)}`,
    logIndex: 0,
  }
}

/**
 * Extracts the relayer of a vault transact by `caller`, which SENDER sends,
 * with `after` following it in the receipt.
 */
function extractPrivacyPoolsV2Relayer(
  caller: EthereumAddress,
  after: ReceiptLog[],
) {
  const encoded = privacyPoolsV2VaultInterface.encodeEventLog('Transacted', [
    [1],
    [2],
    ASSET,
    1_000n,
    caller,
  ])
  const transact: Log = {
    address: CONTRACT.toString(),
    data: encoded.data,
    topics: encoded.topics,
    blockNumber: 100,
    blockHash: `0x${'cc'.repeat(32)}`,
    transactionHash: TRANSACTION_HASH,
    logIndex: 0,
  }
  const logs = [
    transact,
    ...after.map((log, i) => ({ ...log, logIndex: i + 1 })),
  ]
  const rpc = mockObject<IRpcClient>({
    getTransactionReceipt: mockFn<
      IRpcClient['getTransactionReceipt']
    >().resolvesTo({ logs }),
    getTransaction: mockFn<IRpcClient['getTransaction']>().resolvesTo({
      hash: TRANSACTION_HASH,
      value: undefined,
      from: SENDER.toString(),
      to: undefined,
      data: undefined,
      type: undefined,
      calls: undefined,
      blobVersionedHashes: undefined,
      blockNumber: 100,
    }),
  })
  return extractPrivacyRelayerActivity(
    config('privacyPoolsV2Withdrawal'),
    transact,
    { rpc, receipts: new ReceiptLogCache(rpc) },
  )
}

function processorLog(eventName: string, args: unknown[]): ReceiptLog {
  const encoded = privacyPoolsV2ProcessorInterface.encodeEventLog(
    eventName,
    args,
  )
  return { address: PROCESSOR.toString(), ...encoded, logIndex: 0 }
}
