import type { Logger } from '@l2beat/backend-tools'
import { flattenStartingFrom, type IEtherscanClient } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function fetchAndFlatten(
  address: EthereumAddress,
  client: IEtherscanClient,
  logger: Logger,
  includeAll: boolean,
): Promise<string> {
  logger.info('Fetching contract source code...')
  const source = await client.getContractSource(address)

  logger.info('Flattening...')
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
