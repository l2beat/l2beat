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
  chain: string,
  templateId: string,
  fileName: string,
) {
  const rawAddress = address.split(':')[1] as EthereumAddress
  const discovery = configReader.readDiscovery(project, chain)

  const chainConfig = getChainConfig(chain)

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, chainConfig.explorer)

  const source = await client.getContractSource(rawAddress)

  const hasBeenCreated = await templateService.ensureTemplateExists(templateId)

  if (hasBeenCreated) {
    templateService.reload()
  }

  return templateService.addToShape(
    templateId,
    chain,
    rawAddress,
    fileName,
    discovery.blockNumber,
    source,
  )
}
