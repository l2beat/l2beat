import type { PrivacyRelayerExtractorConfig } from '@l2beat/config'
import {
  assertUnreachable,
  EthereumAddress,
  type Log,
} from '@l2beat/shared-pure'
import { type BigNumber, utils } from 'ethers'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRpcContext,
  PrivacyRpcLog,
} from '../types'
import { WITHDRAWAL_TOPIC } from '../zkmoney/abi'
import { extractZkMoneyWithdrawalRelayer } from '../zkmoney/relayers'
import {
  getPrivacyPoolsV2Withdrawal,
  PRIVACY_POOLS_V2_TRANSACTED_TOPIC,
  privacyPoolsV2ProcessorInterface,
} from './extractPrivacyPoolsV2Event'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

interface RelayerExtractorDefinition {
  event: string
  extract: (
    log: Log,
    context: PrivacyRpcContext,
  ) => Promise<PrivacyRelayerActivityExtractResult | undefined>
}

const privacyPoolsWithdrawalRelayed: RelayerExtractorDefinition = {
  event: privacyPoolsInterface.getEventTopic('WithdrawalRelayed'),
  extract: (log) => {
    const parsedLog = privacyPoolsInterface.parseLog(log)
    return toRelayerActivity(
      String(parsedLog.args._relayer),
      String(parsedLog.args._recipient),
    )
  },
}

// Privacy Pools v2 reads every withdrawal from the vault, so a new processor
// counts without a new source. A caller that reports no payout, such as a
// 4337 sender, names only the transaction's sender, such as a bundler.
const privacyPoolsV2Withdrawal: RelayerExtractorDefinition = {
  event: PRIVACY_POOLS_V2_TRANSACTED_TOPIC,
  extract: async (log, context) => {
    const withdrawal = await getPrivacyPoolsV2Withdrawal(log, context)
    if (!withdrawal?.paysOut) {
      return undefined
    }
    if (withdrawal.payout === undefined) {
      return toRelayerActivity(withdrawal.sender.toString())
    }
    return extractPrivacyPoolsV2PayoutRelayer(withdrawal.payout)
  },
}

// A processor pays the relayer through its fee recipient. A self-relay leaves
// the fee recipient empty, so the processor names the caller with a zero fee,
// and only paid relays count.
function extractPrivacyPoolsV2PayoutRelayer(
  log: PrivacyRpcLog,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  const { name, args } = privacyPoolsV2ProcessorInterface.parseLog(log)
  switch (name) {
    case 'Relayed':
    case 'RelayedBatch':
      return toPaidRelayerActivity(
        args._fee,
        String(args._feeRecipient),
        String(args._recipient),
      )
    case 'WithdrawnToUnderlying':
      return toPaidRelayerActivity(
        args._feeShares,
        String(args._feeRecipient),
        String(args._recipient),
      )
    // The swap event names no recipient, so a paid fee to a non-zero fee
    // recipient is all that identifies a relayer.
    case 'Executed':
      return toPaidRelayerActivity(args.feeAmount, String(args.feeRecipient))
    default:
      throw new Error('Unexpected Privacy Pools v2 payout', {
        cause: { name },
      })
  }
}

const tornadoCashWithdrawal: RelayerExtractorDefinition = {
  event: tornadoCashInterface.getEventTopic('Withdrawal'),
  extract: (log) => {
    const parsedLog = tornadoCashInterface.parseLog(log)
    return toRelayerActivity(
      String(parsedLog.args.relayer),
      String(parsedLog.args.to),
    )
  },
}

export function getPrivacyRelayerExtractor(
  source: PrivacyRelayerExtractorConfig,
): RelayerExtractorDefinition {
  switch (source.extractor) {
    case 'privacyPoolsWithdrawalRelayed':
      return privacyPoolsWithdrawalRelayed
    case 'privacyPoolsV2Withdrawal':
      return privacyPoolsV2Withdrawal
    case 'tornadoCashWithdrawal':
      return tornadoCashWithdrawal
    case 'zkMoneyWithdrawalRelayer':
      return {
        event: WITHDRAWAL_TOPIC,
        extract: (log, context) =>
          extractZkMoneyWithdrawalRelayer(log, source.params, context),
      }
    default:
      assertUnreachable(source)
  }
}

export function extractPrivacyRelayerActivity(
  source: PrivacyRelayerExtractorConfig,
  log: Log,
  context: PrivacyRpcContext,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  return getPrivacyRelayerExtractor(source).extract(log, context)
}

function toRelayerActivity(
  relayer: string,
  recipient?: string,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  const relayerAddress = EthereumAddress(relayer)

  if (
    relayerAddress === EthereumAddress.ZERO ||
    (recipient !== undefined && relayerAddress === EthereumAddress(recipient))
  ) {
    return Promise.resolve(undefined)
  }

  return Promise.resolve({ relayerAddress })
}

function toPaidRelayerActivity(
  fee: BigNumber,
  relayer: string,
  recipient?: string,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  if (fee.isZero()) {
    return Promise.resolve(undefined)
  }
  return toRelayerActivity(relayer, recipient)
}
