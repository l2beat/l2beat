import { http, type PublicClient, createPublicClient as create } from 'viem'
import {
  type Chain,
  arbitrum,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains'
import type { ChainConfig } from '../config/config'

const CHAINS: Record<string, Chain> = {
  arbitrum: arbitrum,
  base: base,
  ethereum: mainnet,
  gnosis: gnosis,
  optimism: optimism,
  polygonpos: polygon,
}

export function createPublicClient(
  chain: ChainConfig,
): PublicClient | undefined {
  if (!chain.rpcUrl) {
    return
  }
  return create({
    chain: CHAINS[chain.name],
    transport: http(chain.rpcUrl),
  })
}
