import type { ZkMoneyDepositParams } from '@l2beat/config'
import type { ReceiptLog } from '@l2beat/shared'
import { assert, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from '../utils/erc20'
import { DEPOSIT_TOPIC, WITHDRAWAL_TOPIC, zkMoneyInterface } from './abi'

/** Receipt logs of one portal operation, split around its portal event. */
export interface OperationWindow {
  before: ReceiptLog[]
  after: ReceiptLog[]
}

export interface TokenTransfer {
  from: EthereumAddress
  to: EthereumAddress
  amount: bigint
  logIndex: number
}

export interface LocatedDeposit {
  window: OperationWindow
  /** Whoever sent the funding transfer: a SIPA clone or a direct depositor. */
  sender: EthereumAddress
  fundingTransfer: TokenTransfer
}

/**
 * The funding transfer is the unique transfer of the credited amount plus the
 * funding cut into the portal within this operation. Anything else, e.g. a
 * second matching donation, is ambiguous and leaves the deposit unlocated.
 */
export function locateDeposit(
  receipt: ReceiptLog[],
  portalEvent: Log,
  params: ZkMoneyDepositParams,
): LocatedDeposit | undefined {
  const window = findOperationWindow(receipt, portalEvent)
  const credited = BigInt(
    zkMoneyInterface.parseLog(portalEvent).args.amount.toString(),
  )
  const funded = credited + BigInt(params.fundingCut)
  const portal = EthereumAddress(portalEvent.address)
  const candidates = parseTransfers(window.before, params.tokenAddress).filter(
    (transfer) => transfer.to === portal && transfer.amount === funded,
  )
  const [fundingTransfer] = candidates
  if (candidates.length !== 1 || fundingTransfer === undefined) {
    return undefined
  }
  return { window, sender: fundingTransfer.from, fundingTransfer }
}

/**
 * A transaction can batch several portal operations, so evidence for one of
 * them must lie between the neighbouring portal events.
 */
export function findOperationWindow(
  receipt: ReceiptLog[],
  portalEvent: Log,
): OperationWindow {
  const position = receipt.findIndex(
    (log) => log.logIndex === portalEvent.logIndex,
  )
  assert(position >= 0, 'Portal event is missing from its receipt')

  const portal = EthereumAddress(portalEvent.address)
  const isPortalOperation = (log: ReceiptLog) =>
    EthereumAddress(log.address) === portal &&
    (log.topics[0] === DEPOSIT_TOPIC || log.topics[0] === WITHDRAWAL_TOPIC)

  const before = receipt.slice(0, position)
  const after = receipt.slice(position + 1)
  const previous = before.map(isPortalOperation).lastIndexOf(true)
  const next = after.findIndex(isPortalOperation)
  return {
    before: before.slice(previous + 1),
    after: next < 0 ? after : after.slice(0, next),
  }
}

export function parseTransfers(
  logs: ReceiptLog[],
  token: EthereumAddress,
): TokenTransfer[] {
  return logs
    .filter(
      (log) =>
        EthereumAddress(log.address) === token &&
        log.topics[0] === ERC20_TRANSFER_TOPIC,
    )
    .map(parseTransfer)
}

export function parseTransfer(log: ReceiptLog): TokenTransfer {
  const args = erc20Interface.parseLog(log).args
  return {
    from: EthereumAddress(args.from),
    to: EthereumAddress(args.to),
    amount: BigInt(args.value.toString()),
    logIndex: log.logIndex,
  }
}
