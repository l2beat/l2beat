import {
  ChainSpecificAddress,
  type EthereumAddress,
  type ProjectId,
} from '@l2beat/shared-pure'
import type { UsedInProject } from '~/components/projects/sections/permissions/UsedInProject'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { ps } from '~/server/projects'

export interface ContractUtils {
  getChainName(chain: string): string

  getUsedIn(
    projectId: ProjectId,
    chain: string,
    address: EthereumAddress | string,
  ): UsedInProject[]
}

let contractUtils: ContractUtils | undefined

export async function getContractUtils(): Promise<ContractUtils> {
  if (contractUtils) {
    return contractUtils
  }

  const [chainNameMap, usageMap] = await Promise.all([
    getChainNameMap(),
    getContractUsageMap(),
  ])

  contractUtils = createContractUtils(chainNameMap, usageMap)
  return contractUtils
}

async function getChainNameMap() {
  const chains = await ps.getProjects({ select: ['chainConfig'] })
  const chainNameMap = new Map<string, string>()
  for (const p of chains) {
    chainNameMap.set(p.chainConfig.name, p.name)
  }
  return chainNameMap
}

async function getContractUsageMap() {
  const usageMap = new Map<string, Map<EthereumAddress, UsedInProject[]>>()
  function addUsage(
    chain: string,
    address: EthereumAddress,
    usage: UsedInProject,
  ) {
    let byAddress = usageMap.get(chain)
    if (!byAddress) {
      byAddress = new Map()
      usageMap.set(chain, byAddress)
    }
    let uses = byAddress.get(address)
    if (!uses) {
      uses = []
      byAddress.set(address, uses)
    }
    if (!uses.some((x) => x.id === usage.id)) {
      uses.push(usage)
    }
  }

  const [daLayers, projects] = await Promise.all([
    ps.getProjects({ where: ['daLayer'] }),
    ps.getProjects({
      select: ['contracts'],
      optional: ['permissions', 'isScaling', 'isBridge', 'daBridge'],
    }),
  ])

  for (const project of projects) {
    let url = `/scaling/projects/${project.slug}`
    if (project.isBridge) {
      url = `/bridges/projects/${project.slug}`
    } else if (project.daBridge) {
      const layer = daLayers.find((x) => x.id === project.daBridge?.daLayer)
      url = `/data-availability/projects/${layer?.slug}/${project.slug}`
    }

    const basic = {
      id: project.id,
      name: project.name,
      slug: project.slug,
      icon: getProjectIcon(project.slug),
      url,
    }

    for (const chain in project.contracts.addresses) {
      for (const contract of project.contracts.addresses[chain] ?? []) {
        addUsage(chain, ChainSpecificAddress.address(contract.address), {
          ...basic,
          targetName: contract.name,
          type: contract.upgradeability ? 'proxy' : 'implementation',
        })
        for (const impl of contract.upgradeability?.implementations ?? []) {
          addUsage(chain, ChainSpecificAddress.address(impl), {
            ...basic,
            targetName: contract.name,
            type: 'implementation',
          })
        }
      }
    }

    for (const chain in project.permissions) {
      const permissions = [
        ...(project.permissions[chain]?.actors ?? []),
        ...(project.permissions[chain]?.roles ?? []),
      ]
      for (const permission of permissions) {
        for (const account of permission.accounts) {
          addUsage(chain, ChainSpecificAddress.address(account.address), {
            ...basic,
            targetName: permission.name,
            type: 'permission',
          })
        }
      }
    }
  }

  return usageMap
}

function createContractUtils(
  chainNameMap: Map<string, string>,
  usageMap: Map<string, Map<EthereumAddress | string, UsedInProject[]>>,
): ContractUtils {
  return {
    getChainName(chain) {
      const name = chainNameMap.get(chain)
      if (!name) {
        throw new Error(`Unknown chain: ${chain}`)
      }
      return name
    },
    getUsedIn(projectId, chain, address) {
      const usedIn = usageMap.get(chain)?.get(address) ?? []
      return usedIn.filter((x) => x.id !== projectId)
    },
  }
}
