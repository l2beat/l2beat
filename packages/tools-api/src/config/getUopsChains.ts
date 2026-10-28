import { ProjectService } from '@l2beat/config'
import type { UopsChain } from '../modules/uops-module/types'

export async function getUopsChains(): Promise<UopsChain[]> {
  const projects = await new ProjectService().getProjects({
    select: ['activityConfig', 'chainConfig'],
    whereNot: ['archivedAt'],
  })

  const chains: UopsChain[] = []
  for (const project of projects) {
    const blockchainApi = project.chainConfig.apis.find(
      (api) => api.type === 'rpc' || api.type === 'starknet',
    )
    if (!blockchainApi) {
      continue
    }
    const etherscanApi = project.chainConfig.apis.find(
      (api) => api.type === 'etherscan',
    )
    chains.push({
      id: project.id,
      name: project.name,
      blockchainApi,
      explorerUrl: project.chainConfig.explorerUrl,
      etherscanChainId: etherscanApi?.chainId,
    })
  }
  return chains.sort((a, b) => a.name.localeCompare(b.name))
}
