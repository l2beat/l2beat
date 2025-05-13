import {
  type TemplateService,
  getChainConfig,
  getExplorerClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'

export async function createShape(
  templateService: TemplateService,
  address: string,
  chain: string,
  blockNumber: number,
  templateId: string,
  fileName: string,
) {
  const ethereumAddress = EthereumAddress(address)

  const chainConfig = getChainConfig(chain)

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, chainConfig.explorer)

  const source = await client.getContractSource(ethereumAddress)

  const hasBeenCreated = await templateService.ensureTemplateExists(templateId)

  if (hasBeenCreated) {
    templateService.reload()
  }

  return templateService.addToShape(
    templateId,
    chain,
    ethereumAddress,
    fileName,
    blockNumber,
    source,
  )
}
