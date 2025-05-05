import {
  type ExplorerConfig,
  type IEtherscanClient,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export type ExplorerCLIConfiguration = {
  explorerUrl: string
  explorerApiKey: string | undefined
  explorerType: string
  explorerChainId: number | undefined
}

export function getExplorer(
  config: ExplorerCLIConfiguration,
): IEtherscanClient {
  assert(
    config.explorerType !== 'etherscan' || config.explorerApiKey !== undefined,
    'When using etherscan you should provide the API key using --etherscan-key.',
  )

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, {
    type: config.explorerType as ExplorerConfig['type'],
    url: config.explorerUrl.toString(),
    apiKey: config.explorerApiKey ?? 'YourApiKeyToken',
    chainId: config.explorerChainId ?? 1,
  })

  return client
}
