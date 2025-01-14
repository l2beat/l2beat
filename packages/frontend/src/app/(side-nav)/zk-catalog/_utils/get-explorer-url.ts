import { chains } from '@l2beat/config'
import { type ChainId } from '@l2beat/shared-pure'

export function getExplorerUrlByChainId(chainId: ChainId): string | undefined {
  const chain = chains.find((c) => c.chainId === chainId.valueOf())
  if (!chain) {
    console.warn(
      'getExplorerUrlByChainId has not found a chain in config files',
    )
  }
  return chain?.explorerUrl
}
