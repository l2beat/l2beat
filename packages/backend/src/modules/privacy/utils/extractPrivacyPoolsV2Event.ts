import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyRpcContext, PrivacyRpcLog } from '../types'

// The PoolVault holds every asset, so each event indexes the asset and the
// value that crossed the pool boundary.
const poolVaultInterface = new utils.Interface([
  'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
  'event Ragequit(address indexed ragequitter, address indexed asset, uint256 value, uint256 commitment, uint256 nullifierHash, uint256 label)',
])

// The processors a withdrawal goes through: the plain relay, a yield router
// and the swap processor.
export const privacyPoolsV2RelayInterface = new utils.Interface([
  'event Relayed(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding)',
  'event RelayedBatch(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding, uint256 _count)',
])

export const privacyPoolsV2RouterInterface = new utils.Interface([
  'event WithdrawnToUnderlying(address indexed _asset, address indexed _underlying, address indexed _recipient, uint256 _sharesOut, uint256 _underlyingToRecipient, address _feeRecipient, uint256 _feeShares, uint256 _underlyingFee, uint256 _gasFunding)',
])

// The deployed RelaySwaps matches no published source, but its logs carry this
// event, with amounts that add up to the withdrawals they process.
export const privacyPoolsV2SwapsInterface = new utils.Interface([
  'event Executed(address indexed inputToken, address indexed outputToken, uint256 inputAmount, address feeRecipient, uint256 feeAmount)',
])

const DEPOSITED_TOPIC = poolVaultInterface.getEventTopic('Deposited')
const TRANSACTED_TOPIC = poolVaultInterface.getEventTopic('Transacted')
const PROCESSOR_TOPICS = new Set([
  privacyPoolsV2RelayInterface.getEventTopic('Relayed'),
  privacyPoolsV2RelayInterface.getEventTopic('RelayedBatch'),
  privacyPoolsV2RouterInterface.getEventTopic('WithdrawnToUnderlying'),
  privacyPoolsV2SwapsInterface.getEventTopic('Executed'),
])

interface PrivacyPoolsV2Event {
  asset: EthereumAddress
  amount: bigint
}

export function extractPrivacyPoolsV2Event(
  log: PrivacyRpcLog,
): PrivacyPoolsV2Event {
  const parsedLog = poolVaultInterface.parseLog(log)
  const asset = EthereumAddress(parsedLog.args.asset)
  switch (parsedLog.name) {
    case 'Deposited':
      return { asset, amount: BigInt(parsedLog.args.depositedValue.toString()) }
    case 'Transacted':
      return { asset, amount: BigInt(parsedLog.args.withdrawnValue.toString()) }
    case 'Ragequit':
      return { asset, amount: BigInt(parsedLog.args.value.toString()) }
    default:
      throw new Error('Unexpected Privacy Pools v2 event', {
        cause: { name: parsedLog.name },
      })
  }
}

/**
 * The vault pays a Transacted's withdrawn value to its caller. A withdrawal's
 * caller is a processor, which reports the payout in the same transaction. A
 * relayed private transfer has the relayer call the vault, directly or through
 * a wrapper, and take its fee as that payout, so it looks like a withdrawal.
 * A user calling the vault directly to withdraw looks the same, so these rare
 * self-withdrawals drop too, as do withdrawals through a processor that emits
 * none of the known events.
 */
export async function isPrivacyPoolsV2RelayedTransfer(
  log: Log,
  context: PrivacyRpcContext,
): Promise<boolean> {
  if (log.topics[0] !== TRANSACTED_TOPIC) {
    return false
  }
  const caller = EthereumAddress(poolVaultInterface.parseLog(log).args.caller)
  const receiptLogs = await context.receipts.get(log.transactionHash)
  return !receiptLogs.some(
    (receiptLog) =>
      receiptLog.topics[0] !== undefined &&
      PROCESSOR_TOPICS.has(receiptLog.topics[0]) &&
      EthereumAddress(receiptLog.address) === caller,
  )
}

/**
 * A reshield withdraws into the swap processor and deposits the swapped asset
 * again in the same transaction. 0xbow's relayer sends it, so the transaction
 * names no depositor.
 */
export async function isPrivacyPoolsV2Reshield(
  log: Log,
  context: PrivacyRpcContext,
): Promise<boolean> {
  if (log.topics[0] !== DEPOSITED_TOPIC) {
    return false
  }
  const vault = EthereumAddress(log.address)
  const receiptLogs = await context.receipts.get(log.transactionHash)
  return receiptLogs.some(
    (receiptLog) =>
      receiptLog.topics[0] === TRANSACTED_TOPIC &&
      EthereumAddress(receiptLog.address) === vault,
  )
}
