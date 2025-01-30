import { chains } from '@l2beat/config'
import type { ChainId } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'

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
  const chain = chains.find((c) => c.chainId === chainId.valueOf())
  if (!chain) {
    console.warn(
      'getExplorerUrlByChainId has not found a chain in config files',
    )
  }
  return chain?.explorerUrl
}
