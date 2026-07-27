import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type {
  TechnologyContract,
  TechnologyContractAddress,
} from '~/components/projects/sections/ContractEntry'
import { getContractAddressAnchor } from './getContractAddressAnchor'
import type { ContractsSection } from './getContractsSection'
import type { PermissionSection } from './getPermissionsSection'
import { getUnverifiedContractEntries } from './getUnverifiedContractEntries'

const contractAddress = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const permissionAddress = ChainSpecificAddress(
  'eth:0x3333333333333333333333333333333333333333',
)
const secondPermissionAddress = ChainSpecificAddress(
  'eth:0x5555555555555555555555555555555555555555',
)
const unknownAddress = ChainSpecificAddress(
  'eth:0x4444444444444444444444444444444444444444',
)

describe(getUnverifiedContractEntries.name, () => {
  it('links rendered addresses and leaves unknown addresses plain', () => {
    const contracts = makeContractsSection([
      makeTechnologyContract('RollupProxy', [
        makeAddress('contracts', contractAddress, 'RollupProxy'),
      ]),
    ])
    const permissions = makePermissionsSection({
      actors: [
        makeTechnologyContract('ProxyAdmin', [
          makeAddress('permissions', permissionAddress, 'ProxyAdmin account'),
        ]),
      ],
    })

    const result = getUnverifiedContractEntries(
      [contractAddress, permissionAddress, unknownAddress],
      contracts,
      permissions,
    )

    expect(result).toEqual([
      {
        address: contractAddress,
        target: {
          id: `contracts-${contractAddress}`,
          label: 'RollupProxy',
        },
      },
      {
        address: permissionAddress,
        target: {
          id: `permissions-${permissionAddress}`,
          label: 'ProxyAdmin',
        },
      },
      { address: unknownAddress, target: undefined },
    ])
  })

  it('uses account labels for grouped actors', () => {
    const permissions = makePermissionsSection({
      actors: [
        makeTechnologyContract('2 actors', [
          makeAddress('permissions', permissionAddress, 'Sequencer A'),
          makeAddress('permissions', secondPermissionAddress, 'Sequencer B'),
        ]),
      ],
    })

    const result = getUnverifiedContractEntries(
      [permissionAddress, secondPermissionAddress],
      undefined,
      permissions,
    )

    expect(result).toEqual([
      {
        address: permissionAddress,
        target: {
          id: `permissions-${permissionAddress}`,
          label: 'Sequencer A',
        },
      },
      {
        address: secondPermissionAddress,
        target: {
          id: `permissions-${secondPermissionAddress}`,
          label: 'Sequencer B',
        },
      },
    ])
  })

  it('deduplicates chain-specific addresses', () => {
    const result = getUnverifiedContractEntries(
      [contractAddress, contractAddress],
      undefined,
      undefined,
    )

    expect(result).toEqual([{ address: contractAddress, target: undefined }])
  })

  it('keeps the same address on different chains distinct', () => {
    const baseAddress = ChainSpecificAddress(
      'base:0x1111111111111111111111111111111111111111',
    )

    const result = getUnverifiedContractEntries(
      [contractAddress, baseAddress],
      undefined,
      undefined,
    )

    expect(result).toEqual([
      { address: contractAddress, target: undefined },
      { address: baseAddress, target: undefined },
    ])
  })

  it('links unnamed contracts to the contracts section', () => {
    const contracts = makeContractsSection([
      makeTechnologyContract('', [
        makeAddress('contracts', contractAddress, '0x1111...1111'),
      ]),
    ])

    const result = getUnverifiedContractEntries(
      [contractAddress],
      contracts,
      undefined,
    )

    expect(result).toEqual([
      {
        address: contractAddress,
        target: {
          id: `contracts-${contractAddress}`,
          label: undefined,
        },
      },
    ])
  })

  it('links unnamed permissions to the permissions section', () => {
    const permissions = makePermissionsSection({
      actors: [
        makeTechnologyContract('', [
          makeAddress('permissions', permissionAddress, '0x3333...3333'),
        ]),
      ],
    })

    const result = getUnverifiedContractEntries(
      [permissionAddress],
      undefined,
      permissions,
    )

    expect(result).toEqual([
      {
        address: permissionAddress,
        target: {
          id: `permissions-${permissionAddress}`,
          label: undefined,
        },
      },
    ])
  })

  it('omits the generic Contract label', () => {
    const contracts = makeContractsSection([
      makeTechnologyContract('Contract', [
        makeAddress('contracts', contractAddress, '0x1111...1111'),
      ]),
    ])

    const result = getUnverifiedContractEntries(
      [contractAddress],
      contracts,
      undefined,
    )

    expect(result).toEqual([
      {
        address: contractAddress,
        target: {
          id: `contracts-${contractAddress}`,
          label: undefined,
        },
      },
    ])
  })
})

function makeAddress(
  type: 'contracts' | 'permissions',
  address: ChainSpecificAddress,
  name: string,
): TechnologyContractAddress {
  return {
    name,
    href: `https://example.com/${address}`,
    address: ChainSpecificAddress.address(address).toString(),
    verificationStatus: 'unverified',
    anchorId: getContractAddressAnchor(type, address),
  }
}

function makeTechnologyContract(
  name: string,
  addresses: TechnologyContractAddress[],
): TechnologyContract {
  return mockObject<TechnologyContract>({ name, addresses })
}

function makeContractsSection(
  contracts: TechnologyContract[],
): ContractsSection {
  return mockObject<ContractsSection>({
    contracts: { Ethereum: contracts },
  })
}

function makePermissionsSection({
  roles = [],
  actors = [],
}: {
  roles?: TechnologyContract[]
  actors?: TechnologyContract[]
}): PermissionSection {
  return mockObject<PermissionSection>({
    permissionsByChain: {
      Ethereum: { roles, actors },
    },
  })
}
