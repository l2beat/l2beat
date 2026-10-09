import type { Logger } from '@l2beat/backend-tools'
import {
  type ContractSource,
  flattenStartingFrom,
  type IEtherscanClient,
} from '@l2beat/discovery'
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
  const flat = flattenContractSource(source, includeAll)
  if (flat === undefined) {
    throw new Error('Contract has no Solidity sources')
  }
  return flat
}

export function flattenContractSource(
  source: Pick<ContractSource, 'name' | 'rootFile' | 'files' | 'remappings'>,
  includeAll: boolean,
): string | undefined {
  const input = Object.entries(source.files)
    .map(([fileName, content]) => ({
      path: fileName,
      content,
    }))
    .filter((e) => e.path.endsWith('.sol'))
  if (input.length === 0) {
    return undefined
  }

  return flattenStartingFrom(
    source.name,
    source.rootFile,
    input,
    source.remappings,
    { includeAll },
  )
}
