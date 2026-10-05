import type { PrivacyRelayerExtractorConfig } from '@l2beat/config'
import {
  assertUnreachable,
  EthereumAddress,
  type Log,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRpcContext,
} from '../types'
import { DEPOSIT_TOPIC, WITHDRAWAL_TOPIC } from '../zkmoney/abi'
import {
  findZkMoneyDepositFinalizer,
  findZkMoneyWithdrawalFinalizer,
} from '../zkmoney/paidFinalizers'

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
    case 'tornadoCashWithdrawal':
      return tornadoCashWithdrawal
    case 'zkMoneyDepositPayout':
      return {
        event: DEPOSIT_TOPIC,
        extract: async (log, context) =>
          toPaidFinalizer(
            await findZkMoneyDepositFinalizer(log, source.params, context),
          ),
      }
    case 'zkMoneyWithdrawalPayout':
      return {
        event: WITHDRAWAL_TOPIC,
        extract: async (log, context) =>
          toPaidFinalizer(
            await findZkMoneyWithdrawalFinalizer(log, source.params, context),
          ),
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
  recipient: string,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  const relayerAddress = EthereumAddress(relayer)
  const recipientAddress = EthereumAddress(recipient)

  if (
    relayerAddress === EthereumAddress.ZERO ||
    relayerAddress === recipientAddress
  ) {
    return Promise.resolve(undefined)
  }

  return Promise.resolve({ relayerAddress })
}

function toPaidFinalizer(
  finalizer: EthereumAddress | undefined,
): PrivacyRelayerActivityExtractResult | undefined {
  return finalizer && { relayerAddress: finalizer }
}
