import { flattenStartingFrom } from '@l2beat/discovery'
import type { ExplorerConfig } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { type CliLogger, HttpClient } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { createExplorerClient } from './createExplorerForCli'

export async function fetchAndFlatten(
  address: EthereumAddress,
  explorerUrl: string,
  apiKey: string | undefined,
  chainId: number | undefined,
  type: ExplorerConfig['type'],
  logger: CliLogger,
  includeAll: boolean,
): Promise<string> {
  const httpClient = new HttpClient()
  const client = createExplorerClient(httpClient, type, {
    chainId,
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
