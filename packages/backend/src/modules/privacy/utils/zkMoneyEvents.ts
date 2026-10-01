import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'

export const zkMoneyInterface = new utils.Interface([
  'event Deposit(bytes32 indexed recipientCommitment, uint256 amount, bytes32 key, uint256 index)',
  'event WithdrawalOrRefund(uint8 indexed flow, bytes32 indexed nullifier, address indexed executor, uint256 executionAmount)',
  'event Sweep(uint256 index, uint256 amount)',
  'event Recovered(address indexed token, address indexed target, uint256 amount)',
  'function cloneImplementation(address clone) view returns (address)',
  'function sipaIntentOf(address sipa) view returns (uint8)',
])
export const tokenInterface = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address account) view returns (uint256)',
])

export type ReceiptLog = PrivacyRpcLog

export function eventKey(log: { transactionHash: string; logIndex: number }) {
  return `${log.transactionHash.toLowerCase()}:${log.logIndex}`
}

/** Receipt order is necessary for batched operations and transfers in the same block. */
export function findReceiptEvent(logs: ReceiptLog[], event: PrivacyRpcLog) {
  return logs.findIndex(
    (log) =>
      log.address.toLowerCase() === event.address.toLowerCase() &&
      log.data === event.data &&
      log.topics.join() === event.topics.join(),
  )
}

export function transfers(logs: ReceiptLog[], token: string) {
  return logs.flatMap((log) => {
    if (
      log.address.toLowerCase() !== token.toLowerCase() ||
      log.topics[0] !== tokenInterface.getEventTopic('Transfer')
    )
      return []
    const args = tokenInterface.parseLog(log).args
    return [
      {
        from: String(args.from).toLowerCase(),
        to: String(args.to).toLowerCase(),
        amount: BigInt(args.value.toString()),
        log,
      },
    ]
  })
}
