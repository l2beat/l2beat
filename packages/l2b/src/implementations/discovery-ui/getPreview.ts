import {
  ProjectDiscovery,
  ScalingProjectContract,
  ScalingProjectPermission,
  ScalingProjectPermissionedAccount,
  bridges,
  isSingleAddress,
  layer2s,
  layer3s,
} from '@l2beat/config'
import { ConfigReader } from '@l2beat/discovery'
import { toAddress } from './toAddress'
import {
  ApiAddressType,
  ApiPreviewContract,
  ApiPreviewPermission,
  ApiPreviewResponse,
} from './types'

type ContractNames = { [address: string]: string }
const allProjects = [...layer2s, ...layer3s, ...bridges]

export function getPreview(
  configReader: ConfigReader,
  projectId: string,
): ApiPreviewResponse {
  const projectChains: string[] =
    configReader.readAllChainsForProject(projectId)

  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    return getError('unknown-project')
  }
  if (!('discoveryDrivenData' in project)) {
    return getError('not-discovery-driven')
  }

  // sort chains, keeping the host chain first
  const hostChain = 'hostChain' in project ? project.hostChain : 'ethereum'
  projectChains.sort((a, b) => {
    if (a === hostChain) return -1
    if (b === hostChain) return 1
    return a.localeCompare(b)
  })

  const permissions: {
    chain: string
    permissions: ScalingProjectPermission[]
  }[] = []
  const contracts: { chain: string; contracts: ScalingProjectContract[] }[] = []

  const namesPerChain: { [chain: string]: ContractNames } = {}
  projectChains.forEach((chain) => {
    const discovery = configReader.readDiscovery(projectId, chain)
    const processor = new ProjectDiscovery(projectId, chain)
    const names: ContractNames = {}
    discovery.contracts.forEach((c) => {
      names[c.address] = c.name
    })
    namesPerChain[chain] = names
    permissions.push({
      chain,
      permissions: processor.getDiscoveredPermissions(),
    })
    contracts.push({ chain, contracts: processor.getDiscoveredContracts() })
  })

  return {
    status: 'success',
    permissionsPerChain: getPermissionsPreview(permissions, namesPerChain),
    contractsPerChain: getContractsPreview(contracts, namesPerChain),
  }
}

function getError(status: ApiPreviewResponse['status']): ApiPreviewResponse {
  return {
    status,
    permissionsPerChain: [],
    contractsPerChain: [],
  }
}

function getPermissionsPreview(
  permissionsPerChain: {
    chain: string
    permissions: ScalingProjectPermission[]
  }[],
  namesPerChain: { [chain: string]: ContractNames },
): { chain: string; permissions: ApiPreviewPermission[] }[] {
  return permissionsPerChain.map(({ chain, permissions }) => ({
    chain,
    permissions: permissions.map((p) => ({
      addresses: p.accounts.map((a) => ({
        type: 'address',
        name: namesPerChain[chain][a.address],
        address: toAddress(chain, a.address),
        addressType: toApiAddressType(a.type),
      })),
      name: p.name,
      description: p.description,
      multisigParticipants: p.participants?.map((x) => ({
        type: 'address',
        name: namesPerChain[chain][x.address],
        address: toAddress(chain, x.address),
        addressType: toApiAddressType(x.type),
      })),
    })),
  }))
}

function getContractsPreview(
  contractsPerChain: { chain: string; contracts: ScalingProjectContract[] }[],
  namesPerChain: { [chain: string]: ContractNames },
): { chain: string; contracts: ApiPreviewContract[] }[] {
  return contractsPerChain.map(({ chain, contracts }) => ({
    chain,
    contracts: contracts.map((c) => {
      const addresses = isSingleAddress(c) ? [c.address] : c.multipleAddresses

      return {
        addresses: addresses.map((a) => ({
          type: 'address',
          name: namesPerChain[chain][a],
          address: toAddress(chain, a),
          addressType: 'Contract',
        })),
        name: c.name,
        description: c.description ?? '',
      }
    }),
  }))
}

function toApiAddressType(
  type: ScalingProjectPermissionedAccount['type'],
): ApiAddressType {
  return type === 'MultiSig' ? 'Multisig' : type
}
