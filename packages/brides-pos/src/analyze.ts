import {
  type Block,
  type Log,
  decodeEventLog,
  decodeFunctionData,
  parseAbi,
} from 'viem'
import type { ChainInfo, CrossChainSend } from './types'

export type BlockWithTxs = Block<bigint, true, 'latest'>
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

export function analyzeBlock(
  block: BlockWithTxs,
  chain: ChainInfo,
): CrossChainSend[] {
  const txs: CrossChainSend[] = []
  for (const tx of block.transactions) {
    if (!tx.to) {
      continue
    }
    const decoded = safeDecodeFn(tx.input)
    if (!decoded) {
      continue
    }
    txs.push({
      timestamp: Number(block.timestamp),
      protocol: 'ERC20 transfer',
      source: {
        chain: chain.name,
        txHash: tx.hash,
        token: `${chain.addressPrefix}:${tx.to}`,
        amount: decoded.args[1],
        sender: `${chain.addressPrefix}:${tx.from}`,
      },
      destination: {
        chain: chain.name,
        token: `${chain.addressPrefix}:${tx.to}`,
        amount: decoded.args[1],
        recipient: `${chain.addressPrefix}:${decoded.args[0]}`,
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

function safeDecodeFn(input: `0x${string}`) {
  try {
    return decodeFunctionData({ abi, data: input })
  } catch {
    return undefined
  }
}
