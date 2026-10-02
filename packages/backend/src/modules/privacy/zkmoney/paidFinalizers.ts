import type {
  ZkMoneyDepositPayoutParams,
  ZkMoneyWithdrawalPayoutParams,
} from '@l2beat/config'
import type { EthereumAddress, Log } from '@l2beat/shared-pure'
import type { PrivacyRpcContext } from '../types'
import { resolveDeposit } from './deposits'
import { findDepositFinalizer, findWithdrawalFinalizer } from './payouts'

/** Whoever was paid the sweep fee for finalizing this portal deposit. */
export async function findZkMoneyDepositFinalizer(
  portalEvent: Log,
  params: ZkMoneyDepositPayoutParams,
  context: PrivacyRpcContext,
): Promise<EthereumAddress | undefined> {
  const deposit = await resolveDeposit(portalEvent, params, context)
  if (deposit === undefined) return undefined
  return findDepositFinalizer(deposit, portalEvent, params)
}

/** Whoever was paid the tip for finalizing this portal withdrawal or refund. */
export async function findZkMoneyWithdrawalFinalizer(
  portalEvent: Log,
  params: ZkMoneyWithdrawalPayoutParams,
  context: PrivacyRpcContext,
): Promise<EthereumAddress | undefined> {
  const receipt = await context.receipts.get(portalEvent.transactionHash)
  return findWithdrawalFinalizer(receipt, portalEvent, params)
}
