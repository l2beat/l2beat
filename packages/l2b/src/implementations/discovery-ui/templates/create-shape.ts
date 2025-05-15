import {
  type TemplateService,
  getChainConfig,
  getExplorerClient,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function createShape(
  templateService: TemplateService,
  address: EthereumAddress,
  chain: string,
  blockNumber: number,
  templateId: string,
  fileName: string,
) {
  const chainConfig = getChainConfig(chain)

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, chainConfig.explorer)

  const source = await client.getContractSource(address)

  const hasBeenCreated = await templateService.ensureTemplateExists(templateId)

  if (hasBeenCreated) {
    templateService.reload()
  }

  return templateService.addToShape(
    templateId,
    chain,
    [address],
    fileName,
    blockNumber,
    [source],
  )
}
