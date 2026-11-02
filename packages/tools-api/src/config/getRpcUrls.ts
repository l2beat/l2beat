import type { ChainConfig } from '@l2beat/config'
import type { Chain } from './types'

export function getRpcUrls(
  chains: Chain[],
  alchemyApiKey: string,
  chainConfigs: ChainConfig[],
): Record<number, string> {
  const rpcUrls: Record<number, string> = {}
  for (const chain of chains) {
    rpcUrls[chain.chainId] = getRpcUrl(chain, alchemyApiKey, chainConfigs)
  }
  return rpcUrls
}

function getRpcUrl(
  chain: Chain,
  alchemyApiKey: string,
  chainConfigs: ChainConfig[],
): string {
  if (chain.alchemyId !== undefined) {
    return `https://${chain.alchemyId}.g.alchemy.com/v2/${alchemyApiKey}`
  }
  const chainConfig = chainConfigs.find((x) => x.chainId === chain.chainId)
  const rpc = chainConfig?.apis.find((api) => api.type === 'rpc')
  if (rpc === undefined) {
    throw new Error('No RPC URL for chain', {
      cause: { chainId: chain.chainId },
    })
  }
  return rpc.url
}
