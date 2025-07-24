import {
  getChainConfig,
  getExplorerClient,
  type TemplateService,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function createShape(
  templateService: TemplateService,
  addresses: EthereumAddress[],
  chain: string,
  timestamp: number,
  templateId: string,
  fileName: string,
) {
  const chainConfig = getChainConfig(chain)

  const httpClient = new HttpClient()
  const client = getExplorerClient(httpClient, chainConfig.explorer)

  const sources = await Promise.all(
    addresses.map(async (address) => client.getContractSource(address)),
  )

  const hasBeenCreated = templateService.ensureTemplateExists(templateId)

  if (hasBeenCreated) {
    templateService.reload()
  }

  return templateService.addToShape(
    templateId,
    chain,
    addresses,
    fileName,
    timestamp,
    sources,
  )
}
