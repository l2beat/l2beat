import { type Block, decodeFunctionData, parseAbi } from 'viem'
import type { ChainInfo, CrossChainSend } from './types'

export type BlockWithTxs = Block<bigint, true, 'latest'>

const abi = parseAbi(['function transfer(address recipient, uint256 amount)'])

export function analyzeBlock(
  block: BlockWithTxs,
  chain: ChainInfo,
): CrossChainSend[] {
  const txs: CrossChainSend[] = []
  for (const tx of block.transactions) {
    if (!tx.to) {
      continue
    }
    const decoded = safeDecode(tx.input)
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

function safeDecode(input: `0x${string}`) {
  try {
    return decodeFunctionData({ abi, data: input })
  } catch {
    return undefined
  }
}
