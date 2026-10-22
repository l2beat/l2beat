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
} from '../types'
import { WITHDRAWAL_TOPIC } from '../zkmoney/abi'
import { extractZkMoneyWithdrawalRelayer } from '../zkmoney/relayers'
import {
  privacyPoolsV2RelayInterface,
  privacyPoolsV2RouterInterface,
  privacyPoolsV2SwapsInterface,
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

// Privacy Pools v2 pays the relayer through the fee recipient of each
// processor. A self-relay leaves the fee recipient empty, so the processor
// names the caller with a zero fee, and only paid relays count.
const extractPrivacyPoolsV2Relay: RelayerExtractorDefinition['extract'] = (
  log,
) => {
  const parsedLog = privacyPoolsV2RelayInterface.parseLog(log)
  return toPaidRelayerActivity(
    parsedLog.args._fee,
    String(parsedLog.args._feeRecipient),
    String(parsedLog.args._recipient),
  )
}

const privacyPoolsV2Relayed: RelayerExtractorDefinition = {
  event: privacyPoolsV2RelayInterface.getEventTopic('Relayed'),
  extract: extractPrivacyPoolsV2Relay,
}

const privacyPoolsV2RelayedBatch: RelayerExtractorDefinition = {
  event: privacyPoolsV2RelayInterface.getEventTopic('RelayedBatch'),
  extract: extractPrivacyPoolsV2Relay,
}

const privacyPoolsV2RouterWithdrawal: RelayerExtractorDefinition = {
  event: privacyPoolsV2RouterInterface.getEventTopic('WithdrawnToUnderlying'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2RouterInterface.parseLog(log)
    return toPaidRelayerActivity(
      parsedLog.args._feeShares,
      String(parsedLog.args._feeRecipient),
      String(parsedLog.args._recipient),
    )
  },
}

// The swap event names no recipient, so a paid fee to a non-zero fee
// recipient is all that identifies a relayer.
const privacyPoolsV2SwapExecuted: RelayerExtractorDefinition = {
  event: privacyPoolsV2SwapsInterface.getEventTopic('Executed'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2SwapsInterface.parseLog(log)
    return toPaidRelayerActivity(
      parsedLog.args.feeAmount,
      String(parsedLog.args.feeRecipient),
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
    case 'privacyPoolsV2Relayed':
      return privacyPoolsV2Relayed
    case 'privacyPoolsV2RelayedBatch':
      return privacyPoolsV2RelayedBatch
    case 'privacyPoolsV2RouterWithdrawal':
      return privacyPoolsV2RouterWithdrawal
    case 'privacyPoolsV2SwapExecuted':
      return privacyPoolsV2SwapExecuted
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
