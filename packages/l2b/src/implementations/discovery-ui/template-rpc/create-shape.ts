import {
  type ConfigReader,
  type TemplateService,
  getChainConfig,
  getExplorerClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function createShape(
  templateService: TemplateService,
  configReader: ConfigReader,
  project: string,
  address: string,
  templateId: string,
  chain: string,
) {
  const discovery = configReader.readDiscovery(project, chain)

  const chainConfig = getChainConfig(chain)

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, chainConfig.explorer)

  const source = await client.getContractSource(
    address.split(':')[1] as EthereumAddress,
  )

  await templateService.addToShape(
    templateId,
    chain,
    address.split(':')[1] as EthereumAddress,
    'contract.sol',
    discovery.blockNumber,
    source,
  )
}
