import { type Log, decodeEventLog, parseAbi } from 'viem'
import type { ChainInfo } from '../config/chains'
import type { CrossChainSend } from './types'

export type LogWithTimestamp = Log & { timestamp: number }

const abi = parseAbi([
  'function transfer(address recipient, uint256 amount)',
  'event Transfer(address indexed sender, address indexed recipient, uint256 amount)',
])

export function analyzeLogs(
  logs: LogWithTimestamp[],
  chain: ChainInfo,
): CrossChainSend[] {
  const txs: CrossChainSend[] = []
  for (const log of logs) {
    const decoded = safeDecodeLog(log)
    if (!decoded) {
      continue
    }
    txs.push({
      timestamp: log.timestamp,
      protocol: 'ERC20 transfer',
      source: {
        chain: chain.name,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        txHash: log.transactionHash!,
        token: `${chain.addressPrefix}:${log.address}`,
        amount: decoded.args.amount,
        sender: `${chain.addressPrefix}:${decoded.args.sender}`,
      },
      destination: {
        chain: chain.name,
        token: `${chain.addressPrefix}:${log.address}`,
        amount: decoded.args.amount,
        recipient: `${chain.addressPrefix}:${decoded.args.recipient}`,
      },
    })
  }
  return txs
}

function safeDecodeLog(log: Log) {
  try {
    return decodeEventLog({ abi, ...log })
  } catch {
    return undefined
  }
}
