import type {
  ZkMoneyDepositPayoutParams,
  ZkMoneyWithdrawalPayoutParams,
} from '@l2beat/config'
import type { ReceiptLog } from '@l2beat/shared'
import { EthereumAddress, type Log } from '@l2beat/shared-pure'
import { SWEEP_TOPIC, zkMoneyInterface } from './abi'
import type { ZkMoneyDeposit } from './deposits'
import {
  findOperationWindow,
  parseTransfers,
  type TokenTransfer,
} from './operation'

type PayoutForwarding = Pick<
  ZkMoneyDepositPayoutParams,
  'tokenAddress' | 'operationExecutor'
>

/**
 * A SIPA sweep sends its fee and then the deposit to the portal, and emits a
 * Sweep matching the portal event. The fee recipient finalized the deposit.
 */
export function findDepositFinalizer(
  deposit: ZkMoneyDeposit,
  portalEvent: Log,
  params: ZkMoneyDepositPayoutParams,
): EthereumAddress | undefined {
  const fee = getSweepFee(deposit, params)
  if (fee === undefined || !isSweptBySender(deposit, portalEvent)) {
    return undefined
  }

  const outgoing = parseTransfers(
    deposit.window.before,
    params.tokenAddress,
  ).filter((transfer) => transfer.from === deposit.sender)
  const portalTransfer = outgoing.at(-1)
  const feeTransfer = outgoing.at(-2)
  if (
    portalTransfer?.to !== EthereumAddress(portalEvent.address) ||
    feeTransfer === undefined ||
    feeTransfer.amount !== fee
  ) {
    return undefined
  }
  return resolvePayoutRecipient(deposit.window.after, feeTransfer, params)
}

/** PlainWithdrawalExecutor transfers the principal first, then the optional tip. */
export function findWithdrawalFinalizer(
  receipt: ReceiptLog[],
  portalEvent: Log,
  params: ZkMoneyWithdrawalPayoutParams,
): EthereumAddress | undefined {
  const { before, after } = findOperationWindow(receipt, portalEvent)
  const args = zkMoneyInterface.parseLog(portalEvent).args
  if (EthereumAddress(args.executor) !== params.executorAddress) {
    return undefined
  }

  const outgoing = parseTransfers(before, params.tokenAddress).filter(
    (transfer) => transfer.from === params.executorAddress,
  )
  const [principal, tip] = outgoing
  if (
    outgoing.length !== 2 ||
    principal === undefined ||
    tip === undefined ||
    principal.amount + tip.amount !== BigInt(args.executionAmount.toString())
  ) {
    return undefined
  }
  return resolvePayoutRecipient(after, tip, params)
}

function getSweepFee(
  deposit: ZkMoneyDeposit,
  params: ZkMoneyDepositPayoutParams,
): bigint | undefined {
  switch (deposit.senderKind) {
    case 'deposit':
      return BigInt(params.depositFee)
    case 'registration':
      return BigInt(params.registrationSweepFee)
    case 'direct':
    case 'invalid':
      return undefined
  }
}

function isSweptBySender(deposit: ZkMoneyDeposit, portalEvent: Log): boolean {
  const credited = zkMoneyInterface.parseLog(portalEvent).args
  return deposit.window.after.some((log) => {
    if (
      EthereumAddress(log.address) !== deposit.sender ||
      log.topics[0] !== SWEEP_TOPIC
    ) {
      return false
    }
    const sweep = zkMoneyInterface.parseLog(log).args
    return sweep.index.eq(credited.index) && sweep.amount.eq(credited.amount)
  })
}

/**
 * The verified OperationExecutor helper forwards fees plus subsidies to its
 * caller, so a payout to it is followed to the single onward recipient.
 * Zero-value payouts and ambiguous forwarding identify nobody.
 */
function resolvePayoutRecipient(
  after: ReceiptLog[],
  payout: TokenTransfer,
  params: PayoutForwarding,
): EthereumAddress | undefined {
  if (payout.to === EthereumAddress.ZERO || payout.amount === 0n) {
    return undefined
  }
  if (payout.to !== params.operationExecutor) return payout.to

  const forwarded = parseTransfers(after, params.tokenAddress).filter(
    (transfer) =>
      transfer.from === payout.to &&
      transfer.amount >= payout.amount &&
      transfer.to !== payout.to &&
      transfer.to !== EthereumAddress.ZERO,
  )
  const [recipient] = forwarded
  return forwarded.length === 1 ? recipient?.to : undefined
}
