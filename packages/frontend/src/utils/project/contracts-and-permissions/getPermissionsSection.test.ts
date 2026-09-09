import type {
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissions,
} from '@l2beat/config'
import { assert, ChainSpecificAddress, ProjectId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { ContractUtils } from './getContractUtils'
import { getPermissionsSection } from './getPermissionsSection'

const ADDRESS_A = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const ADDRESS_B = ChainSpecificAddress(
  'eth:0x2222222222222222222222222222222222222222',
)
const PROJECT_ID = ProjectId('test')

const projectsChangeReport = mockObject<ProjectsChangeReport>({
  projects: {},
})

describe(getPermissionsSection.name, () => {
  it('groups matching single-contract permissions', () => {
    const section = getSection(
      [makePermission('first', ADDRESS_A), makePermission('second', ADDRESS_B)],
      defaultContractUtils,
      projectsChangeReport,
    )

    expect(section.actors.length).toEqual(1)
    expect(section.actors[0]?.groupCount).toEqual(2)
    expect(section.actors[0]?.additionalAnchorIds).toEqual(['second'])
    expect(section.actors[0]?.addresses.map((x) => x.address)).toEqual([
      ChainSpecificAddress.address(ADDRESS_A),
      ChainSpecificAddress.address(ADDRESS_B),
    ])
  })

  it('does not group permissions with different usages', () => {
    const contractUtils = mockObject<ContractUtils>({
      getChainName: (chain) => chain,
      getUsedIn: (_chain, address) =>
        address === ChainSpecificAddress.address(ADDRESS_A)
          ? [
              {
                id: ProjectId('other-project'),
                name: 'Other project',
                slug: 'other-project',
                url: '/other-project',
                icon: '/other-project.png',
                targetName: 'Shared contract',
                type: 'implementation',
              },
            ]
          : [],
    })

    const section = getSection(
      [makePermission('first', ADDRESS_A), makePermission('second', ADDRESS_B)],
      contractUtils,
      projectsChangeReport,
    )

    expect(section.actors.length).toEqual(2)
  })

  it('does not group EOAs', () => {
    const section = getSection(
      [
        makePermission('first', ADDRESS_A, 'EOA'),
        makePermission('second', ADDRESS_B, 'EOA'),
      ],
      defaultContractUtils,
      projectsChangeReport,
    )

    expect(section.actors.length).toEqual(2)
  })

  it('does not group a permission that recently became verified', () => {
    const changeReport = mockObject<ProjectsChangeReport>({
      projects: {
        [PROJECT_ID]: {
          ethereum: {
            implementationChange: [],
            highSeverityFieldChange: [],
            ultimateUpgraderChange: [],
            becameVerified: [ChainSpecificAddress.address(ADDRESS_A)],
          },
        },
      },
    })
    const section = getSection(
      [makePermission('first', ADDRESS_A), makePermission('second', ADDRESS_B)],
      defaultContractUtils,
      changeReport,
    )

    expect(section.actors.length).toEqual(2)
  })
})

const defaultContractUtils = mockObject<ContractUtils>({
  getChainName: (chain) => chain,
  getUsedIn: () => [],
})

function getSection(
  actors: ProjectPermission[],
  contractUtils: ContractUtils,
  changeReport: ProjectsChangeReport,
) {
  const permissions: Record<string, ProjectPermissions> = {
    ethereum: { actors },
  }
  const section = getPermissionsSection(
    {
      id: PROJECT_ID,
      permissions,
      isUnderReview: false,
    },
    contractUtils,
    changeReport,
  )
  assert(section)
  const ethereum = section.permissionsByChain.ethereum
  assert(ethereum)
  return ethereum
}

function makePermission(
  id: string,
  address: ChainSpecificAddress,
  type: ProjectPermissionedAccount['type'] = 'Contract',
): ProjectPermission {
  return {
    id,
    name: 'Shared actor',
    accounts: [
      {
        name: id,
        url: `https://example.com/${id}`,
        address,
        isVerified: true,
        type,
      },
    ],
    chain: 'ethereum',
    description: 'Has the same permissions.',
  }
}
