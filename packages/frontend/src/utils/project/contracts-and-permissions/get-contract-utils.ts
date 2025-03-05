import type { UsedInProject } from '@l2beat/config'
import type { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export interface ContractUtils {
  getChainName(chain: string): string

  getUsedIn(
    projectId: ProjectId,
    chain: string,
    address: EthereumAddress,
  ): UsedInProject[]
}

let contractUtils: ContractUtils | undefined

export async function getContractUtils(): Promise<ContractUtils> {
  if (contractUtils) {
    return contractUtils
  }

  const chains = await ps.getProjects({ select: ['chainConfig'] })
  const chainNameMap = new Map<string, string>()
  for (const p of chains) {
    chainNameMap.set(p.chainConfig.name, p.name)
  }

  contractUtils = createContractUtils(chainNameMap)
  return contractUtils
}

function createContractUtils(chainNameMap: Map<string, string>): ContractUtils {
  return {
    getChainName(chain) {
      const name = chainNameMap.get(chain)
      if (!name) {
        throw new Error(`Unknown chain: ${chain}`)
      }
      return name
    },
    getUsedIn(_projectId, _chain, _address) {
      throw new Error('Not implemeneted')
    },
  }
}
