import { ExplorerType, NetworkExplorerRecord } from '@l2beat/database'
import { Cache } from '../cache/types.js'
import {
  buildCachedEtherscanExplorer,
  buildEtherscanExplorer,
} from './etherscan.js'

export { instantiateExplorer }

export type { NetworkExplorerClient }

type NetworkExplorerClient = ReturnType<typeof buildEtherscanExplorer>

function instantiateExplorer(
  explorer: NetworkExplorerRecord,
  cacheStack?: { cache: Cache; chainId: number },
) {
  switch (explorer.type) {
    case ExplorerType.Etherscan:
      return cacheStack
        ? buildCachedEtherscanExplorer(
            explorer.url,
            explorer.apiKey,
            cacheStack.cache,
            cacheStack.chainId,
          )
        : buildEtherscanExplorer(explorer.url, explorer.apiKey)
    default:
      throw new Error(`Unsupported explorer type: ${explorer.type}`)
  }
}
