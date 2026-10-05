import type { IRpcClient } from '@l2beat/shared'
import { EthereumAddress, type Log, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { utils } from 'ethers'
import type { PrivacyRelayerActivityIndexerConfig } from '../types'
import {
  DEPOSIT_PAYOUT_PARAMS,
  WITHDRAWAL_PAYOUT_PARAMS,
} from '../zkmoney/test/fixtures'
import {
  extractPrivacyRelayerActivity,
  getPrivacyRelayerExtractor,
} from './extractPrivacyRelayerActivity'
import { ReceiptLogCache } from './ReceiptLogCache'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

const CONTRACT = EthereumAddress('0x1111111111111111111111111111111111111111')
const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')
const RECIPIENT = EthereumAddress('0x3333333333333333333333333333333333333333')

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

  // The zk.money config hardcodes these topics for its flow and anonymity set
  // sources, while relayer sources derive them from the backend ABI.
  it('derives the zk.money portal topics hardcoded in the project config', () => {
    expect(
      getPrivacyRelayerExtractor({
        extractor: 'zkMoneyDepositPayout',
        params: DEPOSIT_PAYOUT_PARAMS,
      }).event,
    ).toEqual(
      '0x8154af7b1b360f500640de68c82af19c52c4ad4189d7a7c7a41506e19a1fdd6c',
    )
    expect(
      getPrivacyRelayerExtractor({
        extractor: 'zkMoneyWithdrawalPayout',
        params: WITHDRAWAL_PAYOUT_PARAMS,
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
  extractor: 'privacyPoolsWithdrawalRelayed' | 'tornadoCashWithdrawal',
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
