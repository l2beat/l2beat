import { utils } from 'ethers'
import type { PrivacyRpcLog } from '../types'
import { ERC20_TRANSFER_TOPIC, erc20Interface } from './erc20'

export const zkMoneyInterface = new utils.Interface([
  'event Deposit(bytes32 indexed recipientCommitment, uint256 amount, bytes32 key, uint256 index)',
  'event WithdrawalOrRefund(uint8 indexed flow, bytes32 indexed nullifier, address indexed executor, uint256 executionAmount)',
  'event Sweep(uint256 index, uint256 amount)',
  'event Recovered(address indexed token, address indexed target, uint256 amount)',
])

export function eventKey(log: { transactionHash: string; logIndex: number }) {
  return `${log.transactionHash.toLowerCase()}:${log.logIndex}`
}

export function isEvent(
  log: PrivacyRpcLog,
  contractInterface: utils.Interface,
  name: string,
): boolean {
  return log.topics[0] === contractInterface.getEventTopic(name)
}

export function transfers(logs: PrivacyRpcLog[], token: string) {
  return logs.flatMap((log) => {
    if (
      log.address.toLowerCase() !== token.toLowerCase() ||
      log.topics[0] !== ERC20_TRANSFER_TOPIC
    )
      return []
    const args = erc20Interface.parseLog(log).args
    return [
      {
        from: String(args.from).toLowerCase(),
        to: String(args.to).toLowerCase(),
        amount: BigInt(args.value.toString()),
      },
    ]
  })
}
