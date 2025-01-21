import {
  ProjectDiscovery,
  type ScalingProjectContract,
  type ScalingProjectPermission,
} from '@l2beat/config'
import type { ConfigReader } from '@l2beat/discovery'
import { type ContractsMeta, getMeta } from './getMeta'
import { toAddress } from './toAddress'
import type {
  AddressFieldValue,
  ApiPreviewContract,
  ApiPreviewPermission,
  ApiPreviewResponse,
} from './types'

export function getPreview(
  configReader: ConfigReader,
  projectId: string,
): ApiPreviewResponse {
  const projectChains: string[] =
    configReader.readAllChainsForProject(projectId)

  // sort chains, keeping the host chain first
  const hostChain = 'ethereum'
  projectChains.sort((a, b) => {
    if (a === hostChain) return -1
    if (b === hostChain) return 1
    return a.localeCompare(b)
  })

  const permissionsPerChain: {
    chain: string
    permissions: ScalingProjectPermission[]
  }[] = []
  const contractsPerChain: {
    chain: string
    contracts: ScalingProjectContract[]
  }[] = []

  const metaPerChain: { [chain: string]: ContractsMeta } = {}
  projectChains.forEach((chain) => {
    const discovery = configReader.readDiscovery(projectId, chain)
    metaPerChain[chain] = getMeta(discovery)
    const processor = new ProjectDiscovery(projectId, chain)
    permissionsPerChain.push({
      chain,
      permissions: processor.getDiscoveredPermissions(),
    })
    contractsPerChain.push({
      chain,
      contracts: processor.getDiscoveredContracts(),
    })
  })

  return {
    permissionsPerChain: getPermissionsPreview(
      permissionsPerChain,
      metaPerChain,
    ),
    contractsPerChain: getContractsPreview(contractsPerChain, metaPerChain),
  }
}

function getPermissionsPreview(
  permissionsPerChain: {
    chain: string
    permissions: ScalingProjectPermission[]
  }[],
  metaPerChain: { [chain: string]: ContractsMeta },
): { chain: string; permissions: ApiPreviewPermission[] }[] {
  return permissionsPerChain.map(({ chain, permissions }) => ({
    chain,
    permissions: permissions.map((p) => ({
      addresses: p.accounts.map((a) =>
        toAddressFieldValue(a.address, chain, metaPerChain),
      ),
      name: p.name,
      description: p.description,
      multisigParticipants: p.participants?.map((x) =>
        toAddressFieldValue(x.address, chain, metaPerChain),
      ),
    })),
  }))
}

function getContractsPreview(
  contractsPerChain: { chain: string; contracts: ScalingProjectContract[] }[],
  metaPerChain: { [chain: string]: ContractsMeta },
): { chain: string; contracts: ApiPreviewContract[] }[] {
  return contractsPerChain.map(({ chain, contracts }) => ({
    chain,
    contracts: contracts.map((c) => {
      return {
        addresses: [toAddressFieldValue(c.address, chain, metaPerChain)],
        name: c.name,
        description: c.description ?? '',
      }
    }),
  }))
}

function toAddressFieldValue(
  address: string,
  chain: string,
  meta: { [chain: string]: ContractsMeta },
): AddressFieldValue {
  return {
    type: 'address',
    name: meta[chain][address].name,
    address: toAddress(chain, address),
    addressType: meta[chain][address].type,
  }
}
