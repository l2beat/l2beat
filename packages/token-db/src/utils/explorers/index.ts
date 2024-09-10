import { ExplorerType, NetworkExplorer } from '@prisma/client'
import {
  buildCachedEtherscanExplorer,
  buildEtherscanExplorer,
} from './etherscan.js'
import { Cache } from '../cache/types.js'

export { instantiateExplorer }

export type { NetworkExplorerClient }

type NetworkExplorerClient = ReturnType<typeof buildEtherscanExplorer>

function instantiateExplorer(
  explorer: NetworkExplorer,
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
