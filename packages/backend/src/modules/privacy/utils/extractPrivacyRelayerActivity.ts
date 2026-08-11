import type { ProjectPrivacyRelayerSource } from '@l2beat/config'
import { assertUnreachable, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRpcLog,
} from '../types'

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

const tornadoCashInterface = new utils.Interface([
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

type RelayerExtractor = ProjectPrivacyRelayerSource['extractor']

interface RelayerExtractorDefinition {
  event: string
  extract: (
    log: PrivacyRpcLog,
  ) => PrivacyRelayerActivityExtractResult | undefined
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
  extractor: RelayerExtractor,
): RelayerExtractorDefinition {
  switch (extractor) {
    case 'privacyPoolsWithdrawalRelayed':
      return privacyPoolsWithdrawalRelayed
    case 'tornadoCashWithdrawal':
      return tornadoCashWithdrawal
    default:
      assertUnreachable(extractor)
  }
}

export function extractPrivacyRelayerActivity(
  source: PrivacyRelayerActivityIndexerConfig,
  log: PrivacyRpcLog,
): PrivacyRelayerActivityExtractResult | undefined {
  return getPrivacyRelayerExtractor(source.extractor).extract(log)
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

  return { relayerAddress, recipientAddress }
}
