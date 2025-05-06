import { flattenStartingFrom } from '@l2beat/discovery'
import type { IEtherscanClient } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import type { CliLogger } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function fetchAndFlatten(
  address: EthereumAddress,
  client: IEtherscanClient,
  logger: CliLogger,
  includeAll: boolean,
): Promise<string> {
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
