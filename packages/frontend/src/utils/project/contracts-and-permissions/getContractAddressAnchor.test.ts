import type {
  ProjectContract,
  ProjectContracts,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissions,
} from '@l2beat/config'
import { assert, ChainSpecificAddress, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import {
  createAddressAnchors,
  getContractAddressAnchor,
} from './getContractAddressAnchor'
import { getContractsSection } from './getContractsSection'
import type { ContractUtils } from './getContractUtils'
import { getPermissionsSection } from './getPermissionsSection'
import { getUnverifiedContractEntries } from './getUnverifiedContractEntries'

const contractAddress = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const adminAddress = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const permissionAddress = ChainSpecificAddress(
  'eth:0x3333333333333333333333333333333333333333',
)

const contractUtils = mockObject<ContractUtils>({
  getChainName: (chain) => chain,
  getUsedIn: () => [],
})

const projectsChangeReport = mockObject<ProjectsChangeReport>({
  projects: {},
})

describe(createAddressAnchors.name, () => {
  it('creates an anchor only for the first occurrence of an address', () => {
    const getAddressAnchor = createAddressAnchors('contracts')

    expect(getAddressAnchor(contractAddress)).toEqual(
      getContractAddressAnchor('contracts', contractAddress),
    )
    expect(getAddressAnchor(contractAddress)).toEqual(undefined)
    expect(getAddressAnchor(adminAddress)).toEqual(
      getContractAddressAnchor('contracts', adminAddress),
    )
  })

  it('keeps unverified targets coupled to rendered section anchors', () => {
    const contracts: ProjectContracts = {
      addresses: {
        polygon: [
          {
            address: contractAddress,
            isVerified: false,
            chain: 'polygon',
            name: 'Rollup',
            upgradeability: {
              proxyType: 'EIP1967 proxy',
              immutable: false,
              implementations: [adminAddress],
              admins: [adminAddress],
            },
          } satisfies ProjectContract,
        ],
      },
      risks: [],
    }
    const account: ProjectPermissionedAccount = {
      name: 'Operator account',
      url: 'https://example.com/operator',
      address: permissionAddress,
      isVerified: false,
      type: 'Contract',
    }
    const permissions: Record<string, ProjectPermissions> = {
      polygon: {
        roles: [],
        actors: [
          {
            id: 'Operator',
            name: 'Operator',
            description: 'Operates the system.',
            accounts: [account],
            chain: 'polygon',
          } satisfies ProjectPermission,
        ],
      },
    }

    const contractsSection = getContractsSection(
      {
        id: ProjectId('test'),
        slug: 'test',
        isVerified: false,
        contracts,
      },
      contractUtils,
      projectsChangeReport,
      [],
      [],
      { total: 0, projects: {} },
    )
    const permissionsSection = getPermissionsSection(
      {
        id: ProjectId('test'),
        permissions,
        isUnderReview: false,
      },
      contractUtils,
      projectsChangeReport,
    )
    assert(contractsSection && permissionsSection)

    const contract = contractsSection.contracts.polygon?.[0]
    const permission =
      permissionsSection.permissionsByChain.polygon?.actors[0]?.addresses[0]
    assert(contract && permission)
    const contractAnchorId = contract.addresses[0]?.anchorId
    const permissionAnchorId = permission.anchorId
    assert(contractAnchorId && permissionAnchorId)

    const entries = getUnverifiedContractEntries(
      [contractAddress, permissionAddress, adminAddress],
      contracts,
      permissions,
    )

    expect(entries).toEqual([
      {
        address: contractAddress,
        target: {
          id: contractAnchorId,
          label: 'Rollup',
        },
      },
      {
        address: permissionAddress,
        target: {
          id: permissionAnchorId,
          label: 'Operator',
        },
      },
      {
        address: adminAddress,
        target: undefined,
      },
    ])
    expect(contract.addresses[1]?.anchorId).toEqual(undefined)
    expect(contract.admins[0]?.anchorId).toEqual(undefined)
  })
})
