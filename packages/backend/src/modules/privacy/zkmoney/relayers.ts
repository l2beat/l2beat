import type { ZkMoneyWithdrawalRelayerParams } from '@l2beat/config'
import type { ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import type {
  PrivacyRelayerActivityExtractResult,
  PrivacyRpcContext,
} from '../types'
import { zkMoneyInterface } from './abi'
import {
  findOperationWindow,
  parseTransfers,
  type TokenTransfer,
} from './operation'

/**
 * Identifies finalizers of the standard withdrawal executor, excluding
 * recipient-linked self-finalizations per operation. Refunds do not count.
 */
export async function extractZkMoneyWithdrawalRelayer(
  portalEvent: Log,
  params: ZkMoneyWithdrawalRelayerParams,
  context: PrivacyRpcContext,
): Promise<PrivacyRelayerActivityExtractResult | undefined> {
  const args = zkMoneyInterface.parseLog(portalEvent).args
  if (
    args.flow !== 0 ||
    EthereumAddress(args.executor) !== params.executorAddress
  )
    return undefined

  const receipt = await context.receipts.get(portalEvent.transactionHash)
  const { before, after } = findOperationWindow(receipt, portalEvent)
  // The executor transfers the principal first, followed by a non-zero tip.
  const outgoing = parseTransfers(before, params.tokenAddress).filter(
    (transfer) => transfer.from === params.executorAddress,
  )
  const [principal, tip] = outgoing
  if (
    (outgoing.length !== 1 && outgoing.length !== 2) ||
    principal === undefined ||
    principal.to === EthereumAddress.ZERO ||
    principal.amount + (tip?.amount ?? 0n) !==
      BigInt(args.executionAmount.toString())
  )
    return undefined

  const finalizer = tip && resolveTipRecipient(after, tip, params)
  if (tip && finalizer === undefined) return undefined

  const transaction = await context.receipts.getTransaction(
    portalEvent.transactionHash,
  )
  const submitter = EthereumAddress(transaction.from)
  if (submitter === principal.to || finalizer === principal.to) {
    return undefined
  }

  if (finalizer !== undefined) {
    return { relayerAddress: finalizer }
  }

  // Without a tip, only a direct portal call identifies the finalizer.
  // A transaction sent to a wallet, bundler or other helper does not establish
  // who called the portal. Ambiguous tipped payouts also stay unattributed.
  if (
    !tip &&
    transaction.to?.toLowerCase() === portalEvent.address.toLowerCase()
  ) {
    return { relayerAddress: submitter }
  }
  return undefined
}

/** Follows the known OperationExecutor's fee and subsidy forwarding to its caller. */
function resolveTipRecipient(
  after: ReceiptLog[],
  tip: TokenTransfer,
  params: ZkMoneyWithdrawalRelayerParams,
): EthereumAddress | undefined {
  if (tip.to === EthereumAddress.ZERO || tip.amount === 0n) return undefined
  if (tip.to !== params.operationExecutor) return tip.to

  const forwarded = parseTransfers(after, params.tokenAddress).filter(
    (transfer) =>
      transfer.from === tip.to &&
      transfer.amount >= tip.amount &&
      transfer.to !== tip.to &&
      transfer.to !== EthereumAddress.ZERO,
  )
  return forwarded.length === 1 ? forwarded[0]?.to : undefined
}
