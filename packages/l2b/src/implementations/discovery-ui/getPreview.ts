import type { ProjectContract, ProjectPermissions } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getAllProjectDiscoveries } from './getDiscoveries'
import { type ContractsMeta, getMeta } from './getMeta'
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
  const discoveries = getAllProjectDiscoveries(configReader, projectId)

  const permissionsPerChain: {
    chain: string
    permissions: ProjectPermissions
  }[] = []
  const contractsPerChain: {
    chain: string
    contracts: ProjectContract[]
  }[] = []

  const meta = getMeta(discoveries)
  const processor = new ProjectDiscovery(projectId)
  const wholePermissions = processor.getDiscoveredPermissions()
  const wholeContracts = processor.getDiscoveredContracts()
  for (const [chain, permissions] of Object.entries(wholePermissions)) {
    permissionsPerChain.push({ chain, permissions })
  }
  for (const [chain, contracts] of Object.entries(wholeContracts)) {
    contractsPerChain.push({ chain, contracts })
  }

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
        addresses: p.accounts.map((a) => toAddressFieldValue(a.address, meta)),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, meta),
        ),
      })),
      actors: (permissions.actors ?? []).map((p) => ({
        addresses: p.accounts.map((a) => toAddressFieldValue(a.address, meta)),
        name: p.name,
        description: p.description,
        multisigParticipants: p.participants?.map((x) =>
          toAddressFieldValue(x.address, meta),
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
        addresses: [toAddressFieldValue(c.address, meta)],
        name: c.name,
        description: c.description ?? '',
        upgradableBy: c.upgradableBy,
      }
    }),
  }))
}

function toAddressFieldValue(
  address: ChainSpecificAddress,
  meta: ContractsMeta,
): AddressFieldValue {
  return {
    type: 'address',
    name: meta[address].name,
    address,
    addressType: meta[address].type,
  }
}
