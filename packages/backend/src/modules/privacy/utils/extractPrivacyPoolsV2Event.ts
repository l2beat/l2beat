import type { ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyFlowExtractResult,
  PrivacyRpcContext,
  PrivacyRpcLog,
} from '../types'

// The PoolVault holds every asset, so each event indexes the asset and the
// value that crossed the pool boundary.
const poolVaultInterface = new utils.Interface([
  'event Deposited(uint256 outputCommitment, address indexed asset, uint256 depositedValue, address indexed caller)',
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
  'event Ragequit(address indexed ragequitter, address indexed asset, uint256 value, uint256 commitment, uint256 nullifierHash, uint256 label)',
])

// The processors a withdrawal goes through report its payout: the plain relay,
// a yield router and the swap processor. The deployed RelaySwaps matches no
// published source, but its logs carry Executed, with amounts that add up to
// the withdrawals they process.
export const privacyPoolsV2ProcessorInterface = new utils.Interface([
  'event Relayed(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding)',
  'event RelayedBatch(address indexed _asset, address indexed _recipient, uint256 _recipientAmount, address indexed _feeRecipient, uint256 _fee, uint256 _gasFunding, uint256 _count)',
  'event WithdrawnToUnderlying(address indexed _asset, address indexed _underlying, address indexed _recipient, uint256 _sharesOut, uint256 _underlyingToRecipient, address _feeRecipient, uint256 _feeShares, uint256 _underlyingFee, uint256 _gasFunding)',
  'event Executed(address indexed inputToken, address indexed outputToken, uint256 inputAmount, address feeRecipient, uint256 feeAmount)',
])

const DEPOSITED_TOPIC = poolVaultInterface.getEventTopic('Deposited')
export const PRIVACY_POOLS_V2_TRANSACTED_TOPIC =
  poolVaultInterface.getEventTopic('Transacted')
const PAYOUT_TOPICS = new Set(
  Object.values(privacyPoolsV2ProcessorInterface.events).map((event) =>
    privacyPoolsV2ProcessorInterface.getEventTopic(event),
  ),
)

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

export interface PrivacyPoolsV2Withdrawal {
  /** The transaction's sender, such as a relayer or a 4337 bundler. */
  sender: EthereumAddress
  /** The caller's payout event, undefined when it emits none of the known ones. */
  payout: ReceiptLog | undefined
  /**
   * A processor reports one payout after the transacts it batches, so only the
   * last transact before it pays out, and a batch is one withdrawal. A caller
   * that reports no payout pays out once, with its last transact.
   */
  paysOut: boolean
}

/**
 * The vault pays a Transacted's withdrawn value to its caller. A relayer that
 * submits a private transfer itself takes its fee that way, so a transact
 * called by the transaction's own sender is no withdrawal. A user withdrawing
 * straight from their wallet looks the same and drops too. Any other caller is
 * a processor, a smart account or a 4337 sender, whatever events it emits.
 */
export async function getPrivacyPoolsV2Withdrawal(
  log: Log,
  context: PrivacyRpcContext,
): Promise<PrivacyPoolsV2Withdrawal | undefined> {
  if (log.topics[0] !== PRIVACY_POOLS_V2_TRANSACTED_TOPIC) {
    return undefined
  }
  const caller = EthereumAddress(poolVaultInterface.parseLog(log).args.caller)
  const transaction = await context.receipts.getTransaction(log.transactionHash)
  const sender = EthereumAddress(transaction.from)
  if (caller === sender) {
    return undefined
  }

  const vault = EthereumAddress(log.address)
  const receiptLogs = await context.receipts.get(log.transactionHash)
  const next = receiptLogs.find(
    (receiptLog) =>
      receiptLog.logIndex > log.logIndex &&
      (isPayoutOf(receiptLog, caller) ||
        isTransactedOf(receiptLog, vault, caller)),
  )
  const payout = next && isPayoutOf(next, caller) ? next : undefined
  return { sender, payout, paysOut: next === undefined || payout !== undefined }
}

/** A Transacted's flow, once its transaction shows it is a withdrawal. */
export async function adjustPrivacyPoolsV2Flow(
  log: Log,
  result: PrivacyFlowExtractResult,
  context: PrivacyRpcContext,
): Promise<PrivacyFlowExtractResult | undefined> {
  if (log.topics[0] !== PRIVACY_POOLS_V2_TRANSACTED_TOPIC) {
    return result
  }
  const withdrawal = await getPrivacyPoolsV2Withdrawal(log, context)
  if (withdrawal === undefined) {
    return undefined
  }
  return { ...result, count: withdrawal.paysOut ? 1 : 0 }
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
      receiptLog.topics[0] === PRIVACY_POOLS_V2_TRANSACTED_TOPIC &&
      EthereumAddress(receiptLog.address) === vault,
  )
}

function isPayoutOf(log: ReceiptLog, caller: EthereumAddress): boolean {
  return (
    log.topics[0] !== undefined &&
    PAYOUT_TOPICS.has(log.topics[0]) &&
    EthereumAddress(log.address) === caller
  )
}

function isTransactedOf(
  log: ReceiptLog,
  vault: EthereumAddress,
  caller: EthereumAddress,
): boolean {
  return (
    log.topics[0] === PRIVACY_POOLS_V2_TRANSACTED_TOPIC &&
    EthereumAddress(log.address) === vault &&
    EthereumAddress(poolVaultInterface.parseLog(log).args.caller) === caller
  )
}
