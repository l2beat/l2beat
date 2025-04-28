import type { ProjectContract, ProjectPermissions } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import type { ConfigReader } from '@l2beat/discovery'
import { getAllProjectDiscoveries } from './getDiscoveries'
import { type ContractsMeta, getMeta } from './getMeta'
import { toAddress } from './toAddress'
import type {
  AddressFieldValue,
  ApiPreviewContract,
  ApiPreviewPermissions,
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
    permissions: ProjectPermissions
  }[] = []
  const contractsPerChain: {
    chain: string
    contracts: ProjectContract[]
  }[] = []

  const discoveries = getAllProjectDiscoveries(configReader, projectId)
  const meta = getMeta(discoveries)
  projectChains.forEach((chain) => {
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
    permissionsPerChain: getPermissionsPreview(permissionsPerChain, meta),
    contractsPerChain: getContractsPreview(contractsPerChain, meta),
  }
}

function getPermissionsPreview(
  permissionsPerChain: {
    chain: string
    permissions: ProjectPermissions
  }[],
  meta: ContractsMeta,
): { chain: string; permissions: ApiPreviewPermissions }[] {
  return permissionsPerChain.map(({ chain, permissions }) => ({
    chain,
    permissions: {
      roles: (permissions.roles ?? []).map((p) => ({
        addresses: p.accounts.map((a) =>
          toAddressFieldValue(a.address, chain, meta),
        ),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, chain, meta),
        ),
      })),
      actors: (permissions.actors ?? []).map((p) => ({
        addresses: p.accounts.map((a) =>
          toAddressFieldValue(a.address, chain, meta),
        ),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, chain, meta),
        ),
      })),
    },
  }))
}

function getContractsPreview(
  contractsPerChain: { chain: string; contracts: ProjectContract[] }[],
  meta: ContractsMeta,
): { chain: string; contracts: ApiPreviewContract[] }[] {
  return contractsPerChain.map(({ chain, contracts }) => ({
    chain,
    contracts: contracts.map((c) => {
      return {
        addresses: [toAddressFieldValue(c.address, chain, meta)],
        name: c.name,
        description: c.description ?? '',
        upgradableBy: c.upgradableBy,
      }
    }),
  }))
}

function toAddressFieldValue(
  rawAddress: string,
  chain: string,
  meta: ContractsMeta,
): AddressFieldValue {
  const address = toAddress(chain, rawAddress)
  return {
    type: 'address',
    name: meta[address].name,
    address,
    addressType: meta[address].type,
  }
}
