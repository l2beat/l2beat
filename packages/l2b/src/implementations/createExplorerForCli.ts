import {
  type EtherscanUnsupportedMethods,
  type IEtherscanClient,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import type { HttpClient } from '@l2beat/shared'

// Maybe use getChainsConfig instead?
export function createExplorerClient(
  httpClient: HttpClient,
  type: 'etherscan' | 'blockscout' | 'routescan' | 'sourcify',
  config: {
    url?: string
    apiKey?: string
    chainId?: number
    unsupported?: EtherscanUnsupportedMethods
  },
): IEtherscanClient {
  switch (type) {
    case 'etherscan':
      if (!config.url || !config.apiKey) {
        throw new Error('Etherscan client requires url and apiKey')
      }
      return getExplorerClient(httpClient, {
        type: 'etherscan',
        url: config.url,
        apiKey: config.apiKey,
        unsupported: config.unsupported,
      })

    case 'blockscout':
      if (!config.url) {
        throw new Error('Blockscout client requires url')
      }
      return getExplorerClient(httpClient, {
        type: 'blockscout',
        url: config.url,
        unsupported: config.unsupported,
      })

    case 'routescan':
      if (!config.url) {
        throw new Error('Routescan client requires url')
      }
      return getExplorerClient(httpClient, {
        type: 'routescan',
        url: config.url,
        unsupported: config.unsupported,
      })

    case 'sourcify':
      if (!config.chainId) {
        throw new Error('Sourcify client requires chainId')
      }
      return getExplorerClient(httpClient, {
        type: 'sourcify',
        chainId: config.chainId,
      })

    default:
      throw new Error(`Unknown explorer type: ${type}`)
  }
}
