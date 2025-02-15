import { chains } from '@l2beat/config'
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
