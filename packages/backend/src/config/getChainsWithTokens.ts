import { ChainConfig } from '@l2beat/config'
import { Token } from '@l2beat/shared-pure'

export function getChainsWithTokens(tokenList: Token[], chains: ChainConfig[]) {
  const results = new Set<string>()
  for (const { chainId } of tokenList) {
    const chain = chains.find((x) => x.chainId === +chainId)
    if (chain) {
      results.add(chain.name)
    }
  }
  return Array.from(results)
}
