import { ChainConfig } from '@l2beat/config'
import { Token } from '@l2beat/shared-pure'

export function getChainsWithTokens(tokenList: Token[], chains: ChainConfig[]) {
  const modules = new Set<string>()

  for (const token of tokenList) {
    const c = token.chainId
    const cc = chains.find((x) => x.chainId === +c)

    if (cc && cc.name !== 'ethereum') modules.add(cc.name)
  }

  return Array.from(modules)
}
