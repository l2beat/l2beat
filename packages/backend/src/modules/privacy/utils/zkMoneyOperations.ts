import type { ZkMoneyPayoutConfig } from '@l2beat/config'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import type { PrivacyRpcLog } from '../types'
import { isEvent, transfers, zkMoneyInterface } from './zkMoneyEvents'

type Transfer = ReturnType<typeof transfers>[number]

export interface ZkMoneyDepositor {
  address: string
  /** Deposit addresses are swept by a finalizer. Other depositors call the portal themselves. */
  isDepositAddress: boolean
}

/** The portal pulls the tokens from the depositor right before it emits Deposit. */
export function findZkMoneyDepositor(
  receipt: PrivacyRpcLog[],
  deposit: PrivacyRpcLog,
  tokenAddress: string,
): ZkMoneyDepositor | undefined {
  const { before, after } = operationLogs(receipt, deposit)
  const portal = deposit.address.toLowerCase()
  const pulled = transfers(before, tokenAddress)
    .filter((transfer) => transfer.to === portal)
    .at(-1)
  if (!pulled) return undefined

  const { index } = zkMoneyInterface.parseLog(deposit).args
  const isDepositAddress = after.some(
    (log) =>
      log.address.toLowerCase() === pulled.from &&
      isEvent(log, zkMoneyInterface, 'Sweep') &&
      zkMoneyInterface.parseLog(log).args.index.eq(index),
  )
  return { address: pulled.from, isDepositAddress }
}

/** A sweep pays its fee right before it sends the rest to the portal. */
export function findZkMoneyDepositFinalizer(
  receipt: PrivacyRpcLog[],
  deposit: PrivacyRpcLog,
  params: ZkMoneyPayoutConfig,
): EthereumAddress | undefined {
  const depositor = findZkMoneyDepositor(receipt, deposit, params.tokenAddress)
  if (!depositor?.isDepositAddress) return undefined

  const { before, after } = operationLogs(receipt, deposit)
  const [fee, funding] = transfers(before, params.tokenAddress)
    .filter((transfer) => transfer.from === depositor.address)
    .slice(-2)
  if (!fee || funding?.to !== deposit.address.toLowerCase()) return undefined

  return findPayee(after, fee, params)
}

/** PlainWithdrawalExecutor pays the recipient first, then the optional tip. */
export function findZkMoneyWithdrawalFinalizer(
  receipt: PrivacyRpcLog[],
  withdrawal: PrivacyRpcLog,
  params: ZkMoneyPayoutConfig & { executorAddress: string },
): EthereumAddress | undefined {
  const executor = params.executorAddress.toLowerCase()
  const args = zkMoneyInterface.parseLog(withdrawal).args
  if (String(args.executor).toLowerCase() !== executor) return undefined

  const { before, after } = operationLogs(receipt, withdrawal)
  const paid = transfers(before, params.tokenAddress).filter(
    (transfer) => transfer.from === executor,
  )
  const [principal, tip] = paid
  if (
    paid.length !== 2 ||
    !principal ||
    !tip ||
    principal.amount + tip.amount !== BigInt(args.executionAmount.toString())
  )
    return undefined

  return findPayee(after, tip, params)
}

/** OperationExecutor forwards what it receives to its caller, who is the one paid. */
function findPayee(
  after: PrivacyRpcLog[],
  payout: Transfer,
  params: ZkMoneyPayoutConfig,
): EthereumAddress | undefined {
  const nobody = EthereumAddress.ZERO.toLowerCase()
  if (payout.amount === 0n || payout.to === nobody) return undefined
  if (payout.to !== params.operationExecutor.toLowerCase())
    return EthereumAddress(payout.to)

  // It forwards fees together with subsidies, so the amount may be larger.
  const forwarded = transfers(after, params.tokenAddress).filter(
    (transfer) =>
      transfer.from === payout.to &&
      transfer.amount >= payout.amount &&
      transfer.to !== payout.to &&
      transfer.to !== nobody,
  )
  const [payee] = forwarded
  return forwarded.length === 1 && payee ? EthereumAddress(payee.to) : undefined
}

/**
 * A transaction can batch several portal operations, so only the logs between
 * the neighbouring portal events belong to this one.
 */
function operationLogs(receipt: PrivacyRpcLog[], event: PrivacyRpcLog) {
  const position = receipt.findIndex(
    (log) =>
      log.address.toLowerCase() === event.address.toLowerCase() &&
      log.data === event.data &&
      log.topics.join() === event.topics.join(),
  )
  assert(position >= 0, 'Portal event is missing from its receipt')

  const isPortalOperation = (log: PrivacyRpcLog) =>
    log.address.toLowerCase() === event.address.toLowerCase() &&
    (isEvent(log, zkMoneyInterface, 'Deposit') ||
      isEvent(log, zkMoneyInterface, 'WithdrawalOrRefund'))
  const operations = receipt.flatMap((log, index) =>
    isPortalOperation(log) ? [index] : [],
  )
  const previous = operations.filter((index) => index < position).at(-1) ?? -1
  const next = operations.find((index) => index > position)
  return {
    before: receipt.slice(previous + 1, position),
    after: receipt.slice(position + 1, next),
  }
}
