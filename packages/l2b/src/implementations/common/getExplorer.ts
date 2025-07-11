import {
  type ExplorerConfig,
  getChainConfig,
  getExplorerClient,
  type IEtherscanClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export type ExplorerCLIConfiguration = {
  chainName: string | undefined
  explorerUrl: string
  explorerApiKey: string | undefined
  explorerType: string
  explorerChainId: number | undefined
}

export function getExplorer(
  config: ExplorerCLIConfiguration,
): IEtherscanClient {
  const explorerConfiguration = getExplorerConfig(config)
  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, explorerConfiguration)

  return client
}

export function getExplorerConfig(
  config: ExplorerCLIConfiguration,
): ExplorerConfig {
  if (config.chainName !== undefined) {
    const chainConfig = getChainConfig(config.chainName)
    return chainConfig.explorer
  }
  assert(
    config.explorerType !== 'etherscan' || config.explorerApiKey !== undefined,
    'When using etherscan you should provide the API key using --etherscan-key.',
  )
  assert(
    config.explorerType !== 'sourcify' || config.explorerChainId !== undefined,
    'When using sourcify you should provide the chainId using --explorer-chain-id.',
  )
  return {
    type: config.explorerType as ExplorerConfig['type'],
    url: config.explorerUrl.toString(),
    apiKey: config.explorerApiKey ?? 'YourApiKeyToken',
    chainId: config.explorerChainId ?? 1,
  }
}
