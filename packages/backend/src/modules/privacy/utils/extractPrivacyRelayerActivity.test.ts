import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type {
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRpcLog,
} from '../types'
import {
  extractPrivacyRelayerActivity,
  getPrivacyRelayerExtractor,
} from './extractPrivacyRelayerActivity'

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
      getPrivacyRelayerExtractor('privacyPoolsWithdrawalRelayed').event,
    ).toEqual(privacyPoolsInterface.getEventTopic('WithdrawalRelayed'))
    expect(getPrivacyRelayerExtractor('tornadoCashWithdrawal').event).toEqual(
      tornadoCashInterface.getEventTopic('Withdrawal'),
    )
  })

  it('extracts Privacy Pools relayer and recipient', () => {
    const log = encodeLog(privacyPoolsInterface, 'WithdrawalRelayed', [
      RELAYER,
      RECIPIENT,
      EthereumAddress('0x4444444444444444444444444444444444444444'),
      1_000n,
      10n,
    ])

    const result = extractPrivacyRelayerActivity(
      config('privacyPoolsWithdrawalRelayed'),
      log,
    )

    expect(result).toEqual({
      relayerAddress: RELAYER,
      recipientAddress: RECIPIENT,
    })
  })

  it('extracts Tornado Cash relayer and recipient', () => {
    const log = encodeLog(tornadoCashInterface, 'Withdrawal', [
      RECIPIENT,
      `0x${'11'.repeat(32)}`,
      RELAYER,
      10n,
    ])

    const result = extractPrivacyRelayerActivity(
      config('tornadoCashWithdrawal'),
      log,
    )

    expect(result).toEqual({
      relayerAddress: RELAYER,
      recipientAddress: RECIPIENT,
    })
  })

  it('ignores a withdrawal submitted by its recipient', () => {
    const log = encodeLog(privacyPoolsInterface, 'WithdrawalRelayed', [
      RECIPIENT,
      RECIPIENT,
      EthereumAddress('0x4444444444444444444444444444444444444444'),
      1_000n,
      0n,
    ])

    const result = extractPrivacyRelayerActivity(
      config('privacyPoolsWithdrawalRelayed'),
      log,
    )

    expect(result).toEqual(undefined)
  })

  it('ignores a Tornado Cash self-withdrawal with the zero relayer address', () => {
    const log = encodeLog(tornadoCashInterface, 'Withdrawal', [
      RECIPIENT,
      `0x${'11'.repeat(32)}`,
      EthereumAddress.ZERO,
      0n,
    ])

    const result = extractPrivacyRelayerActivity(
      config('tornadoCashWithdrawal'),
      log,
    )

    expect(result).toEqual(undefined)
  })
})

function config(
  extractor: PrivacyRelayerActivityIndexerConfig['extractor'],
): PrivacyRelayerActivityIndexerConfig {
  return {
    id: 'test-id',
    projectId: 'test-project',
    chain: 'ethereum',
    address: CONTRACT,
    sinceTimestamp: UnixTime(0),
    event: getPrivacyRelayerExtractor(extractor).event,
    extractor,
  }
}

function encodeLog(
  iface: utils.Interface,
  eventName: string,
  args: unknown[],
): PrivacyRpcLog {
  const encoded = iface.encodeEventLog(eventName, args)
  return {
    address: CONTRACT.toString(),
    data: encoded.data,
    topics: encoded.topics,
  }
}
