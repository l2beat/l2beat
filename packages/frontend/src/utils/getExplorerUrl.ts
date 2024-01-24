import { chains } from '@l2beat/config'
import { assert, ChainId } from '@l2beat/shared-pure'

export function getExplorerUrl(chain: string) {
  const chainConfig = chains.find((c) => c.name === chain)
  assert(
    chainConfig !== undefined,
    'Could not find chain config for chain: ' + chain,
  )
  assert(
    chainConfig.explorerUrl !== undefined,
    'Chain config has no explorerUrl, chain: ' + chainConfig.name,
  )

  return chainConfig.explorerUrl
}

export function getExplorerUrlByChainId(chainId: ChainId): string | undefined {
  return chains.find((c) => c.chainId === chainId.valueOf())?.explorerUrl
}
