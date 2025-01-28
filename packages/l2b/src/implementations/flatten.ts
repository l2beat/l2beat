import { flattenStartingFrom } from '@l2beat/discovery'
import {
  type ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { type CliLogger, HttpClient } from '@l2beat/shared'
import { assert, type EthereumAddress } from '@l2beat/shared-pure'

export async function fetchAndFlatten(
  address: EthereumAddress,
  explorerUrl: string,
  apiKey: string | undefined,
  type: string,
  logger: CliLogger,
  includeAll: boolean,
): Promise<string> {
  assert(
    type !== 'etherscan' || apiKey !== undefined,
    'When using etherscan you should provide the API key using --etherscan-key.',
  )
  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, {
    type: type as ExplorerConfig['type'],
    url: explorerUrl.toString(),
    apiKey: apiKey ?? 'YourApiKeyToken',
  })

  logger.logLine('Fetching contract source code...')
  const source = await client.getContractSource(address)

  logger.logLine('Flattening...')
  const input = Object.entries(source.files)
    .map(([fileName, content]) => ({
      path: fileName,
      content,
    }))
    .filter((e) => e.path.endsWith('.sol'))

  return flattenStartingFrom(source.name, input, source.remappings, {
    includeAll: includeAll,
  })
}
