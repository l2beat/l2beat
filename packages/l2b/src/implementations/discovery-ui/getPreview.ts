import {
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
): ApiPreviewResponse | undefined {
  const project = allProjects.find((p) => p.id === projectId)
  if (!project) {
    return undefined
  }
  const hostChain = project.type === 'layer3' ? project.hostChain : 'ethereum'

  const projectChains = configReader.readAllChainsForProject(projectId)
  const namesPerChain: { [chain: string]: ContractNames } = {}
  projectChains.forEach((chain) => {
    const discovery = configReader.readDiscovery(projectId, chain)
    const names: ContractNames = {}
    discovery.contracts.forEach((c) => {
      names[c.address.toString()] = c.name
    })
    namesPerChain[chain] = names
  })

  const permissions =
    project.permissions === 'UnderReview' || project.permissions === undefined
      ? []
      : project.permissions

  const contracts =
    project.contracts === undefined ? [] : project.contracts.addresses

  return {
    permissions: getPermissionsPreview(permissions, namesPerChain, hostChain),
    contracts: getContractsPreview(contracts, namesPerChain, hostChain),
  }
}

function getPermissionsPreview(
  permissions: ScalingProjectPermission[],
  namesPerChain: { [chain: string]: ContractNames },
  hostChain: string,
): ApiPreviewPermission[] {
  return permissions.map((p): ApiPreviewPermission => {
    const chain = p.chain ?? hostChain
    return {
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
    }
  })
}

function getContractsPreview(
  contracts: ScalingProjectContract[],
  namesPerChain: { [chain: string]: ContractNames },
  hostChain: string,
): ApiPreviewContract[] {
  return contracts.map((c): ApiPreviewContract => {
    const addresses = isSingleAddress(c) ? [c.address] : c.multipleAddresses

    const chain = c.chain ?? hostChain
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
  })
}

function toApiAddressType(
  type: ScalingProjectPermissionedAccount['type'],
): ApiAddressType {
  return type === 'MultiSig' ? 'Multisig' : type
}
