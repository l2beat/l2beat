import { chainsByChainId } from '@l2beat/config'
import { assert, ChainId } from '@l2beat/shared-pure'

export function getExplorerUrl(chainId?: ChainId) {
  const defaultExplorer = 'https://etherscan.io'
  if (chainId === undefined) {
    return defaultExplorer
  }

  const chain = chainsByChainId.get(Number(chainId))
  assert(chain !== undefined, 'Unknown chainId: ' + chainId.toString())
  assert(
    chain.explorerUrl !== undefined,
    'Chain has no explorerUrl: ' + chain.devId,
  )

  return chain.explorerUrl
}
