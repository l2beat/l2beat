import type { ProjectPrivacyOnchainRelayerSource } from '@l2beat/config'
import { assertUnreachable, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRpcLog,
} from '../types'
import { zkMoneyInterface } from './zkMoneyEvents'
import {
  findZkMoneyDepositFinalizer,
  findZkMoneyWithdrawalFinalizer,
} from './zkMoneyOperations'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

type RelayerExtractor = ProjectPrivacyOnchainRelayerSource['extractor']

interface RelayerExtractorDefinition {
  event: string
  /** Set when the event does not name the relayer, so the transaction's other logs are needed. */
  readsReceipt?: true
}

export function getPrivacyRelayerExtractor(
  extractor: RelayerExtractor,
): RelayerExtractorDefinition {
  switch (extractor) {
    case 'privacyPoolsWithdrawalRelayed':
      return { event: privacyPoolsInterface.getEventTopic('WithdrawalRelayed') }
    case 'tornadoCashWithdrawal':
      return { event: tornadoCashInterface.getEventTopic('Withdrawal') }
    case 'zkMoneyDepositPayout':
      return {
        event: zkMoneyInterface.getEventTopic('Deposit'),
        readsReceipt: true,
      }
    case 'zkMoneyWithdrawalPayout':
      return {
        event: zkMoneyInterface.getEventTopic('WithdrawalOrRefund'),
        readsReceipt: true,
      }
    default:
      assertUnreachable(extractor)
  }
}

export function extractPrivacyRelayerActivity(
  source: PrivacyRelayerActivityIndexerConfig,
  log: PrivacyRpcLog,
  receipt: PrivacyRpcLog[] = [],
): PrivacyRelayerActivityExtractResult | undefined {
  switch (source.extractor) {
    case 'privacyPoolsWithdrawalRelayed': {
      const { args } = privacyPoolsInterface.parseLog(log)
      return toRelayerActivity(String(args._relayer), String(args._recipient))
    }
    case 'tornadoCashWithdrawal': {
      const { args } = tornadoCashInterface.parseLog(log)
      return toRelayerActivity(String(args.relayer), String(args.to))
    }
    case 'zkMoneyDepositPayout':
      return toFinalizerActivity(
        findZkMoneyDepositFinalizer(receipt, log, source.params),
      )
    case 'zkMoneyWithdrawalPayout':
      return toFinalizerActivity(
        findZkMoneyWithdrawalFinalizer(receipt, log, source.params),
      )
    default:
      assertUnreachable(source)
  }
}

function toRelayerActivity(
  relayer: string,
  recipient: string,
): PrivacyRelayerActivityExtractResult | undefined {
  const relayerAddress = EthereumAddress(relayer)
  const recipientAddress = EthereumAddress(recipient)

  if (
    relayerAddress === EthereumAddress.ZERO ||
    relayerAddress === recipientAddress
  ) {
    return undefined
  }

  return { relayerAddress }
}

function toFinalizerActivity(
  finalizer: EthereumAddress | undefined,
): PrivacyRelayerActivityExtractResult | undefined {
  return finalizer && { relayerAddress: finalizer }
}
