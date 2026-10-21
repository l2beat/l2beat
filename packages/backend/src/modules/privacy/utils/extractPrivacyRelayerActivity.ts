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

const privacyPoolsInterface = new utils.Interface([
  'event WithdrawalRelayed(address indexed _relayer, address indexed _recipient, address indexed _asset, uint256 _amount, uint256 _feeAmount)',
])

// Privacy Pools v2 pays the relayer through the fee recipient of each
// processor: the plain relay, a yield router and the swap processor. A
// self-relay leaves the fee recipient empty, so the processor names the caller
// with a zero fee, and only paid relays count.
const privacyPoolsV2RelayInterface = new utils.Interface([
  'event Relayed(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding)',
  'event RelayedBatch(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding, uint256 _count)',
])

const privacyPoolsV2RouterInterface = new utils.Interface([
  'event WithdrawnToUnderlying(address indexed _asset, address indexed _underlying, address indexed _recipient, uint256 _sharesOut, uint256 _underlyingToRecipient, address _feeRecipient, uint256 _feeShares, uint256 _underlyingFee, uint256 _gasFunding)',
])

const privacyPoolsV2SwapsInterface = new utils.Interface([
  'event Executed(address indexed inputToken, address indexed outputToken, uint256 inputAmount, address feeRecipient, uint256 feeAmount)',
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

const privacyPoolsV2Relayed: RelayerExtractorDefinition = {
  event: privacyPoolsV2RelayInterface.getEventTopic('Relayed'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2RelayInterface.parseLog(log)
    return toPaidRelayerActivity(
      String(parsedLog.args._feeRecipient),
      String(parsedLog.args._recipient),
      parsedLog.args._fee,
    )
  },
}

const privacyPoolsV2RelayedBatch: RelayerExtractorDefinition = {
  event: privacyPoolsV2RelayInterface.getEventTopic('RelayedBatch'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2RelayInterface.parseLog(log)
    return toPaidRelayerActivity(
      String(parsedLog.args._feeRecipient),
      String(parsedLog.args._recipient),
      parsedLog.args._fee,
    )
  },
}

const privacyPoolsV2RouterWithdrawal: RelayerExtractorDefinition = {
  event: privacyPoolsV2RouterInterface.getEventTopic('WithdrawnToUnderlying'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2RouterInterface.parseLog(log)
    return toPaidRelayerActivity(
      String(parsedLog.args._feeRecipient),
      String(parsedLog.args._recipient),
      parsedLog.args._feeShares,
    )
  },
}

// A swap has no recipient in the event, so only a zero fee recipient is
// dropped.
const privacyPoolsV2SwapExecuted: RelayerExtractorDefinition = {
  event: privacyPoolsV2SwapsInterface.getEventTopic('Executed'),
  extract: (log) => {
    const parsedLog = privacyPoolsV2SwapsInterface.parseLog(log)
    return toPaidRelayerActivity(
      String(parsedLog.args.feeRecipient),
      EthereumAddress.ZERO.toString(),
      parsedLog.args.feeAmount,
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

function toPaidRelayerActivity(
  relayer: string,
  recipient: string,
  fee: BigNumber,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  if (fee.isZero()) {
    return Promise.resolve(undefined)
  }
  return toRelayerActivity(relayer, recipient)
}
