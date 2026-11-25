import { ProjectService } from '@l2beat/config'
import type { UopsChain } from '../modules/uops-module/types'
import { getAlchemyUrl } from './getRpcUrls'
import type { Chain } from './types'

// Config RPCs are often public endpoints that go away or need a key that the
// backend sets through env. Alchemy goes first where it has the chain, and the
// config RPC stays as the fallback for networks the Alchemy app has not enabled.
export async function getUopsChains(
  chains: Chain[],
  alchemyApiKey: string,
): Promise<UopsChain[]> {
  const projects = await new ProjectService().getProjects({
    select: ['activityConfig', 'chainConfig'],
    whereNot: ['archivedAt'],
  })

  const uopsChains: UopsChain[] = []
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
    const chain = chains.find((c) => c.chainId === project.chainConfig.chainId)
    uopsChains.push({
      id: project.id,
      name: project.name,
      blockchainApi,
      alchemyUrl:
        chain && blockchainApi.type === 'rpc'
          ? getAlchemyUrl(chain, alchemyApiKey)
          : undefined,
      explorerUrl: project.chainConfig.explorerUrl,
      etherscanChainId: etherscanApi?.chainId,
    })
  }
  return uopsChains.sort((a, b) => a.name.localeCompare(b.name))
}
