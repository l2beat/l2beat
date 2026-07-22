import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getUnverifiedContractEntries } from './getUnverifiedContractEntries'

const contractAddress = ChainSpecificAddress(
  'eth:0x1111111111111111111111111111111111111111',
)
const permissionAddress = ChainSpecificAddress(
  'eth:0x3333333333333333333333333333333333333333',
)
const unknownAddress = ChainSpecificAddress(
  'eth:0x4444444444444444444444444444444444444444',
)

describe(getUnverifiedContractEntries.name, () => {
  it('links known addresses to their sections and leaves unknown addresses plain', () => {
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: 'RollupProxy',
            chain: 'ethereum',
            address: contractAddress,
            isVerified: false,
          },
        ],
      },
    })
    const permissions = mockObject<Record<string, ProjectPermissions>>({
      ethereum: {
        roles: [],
        actors: [
          {
            id: 'ProxyAdmin',
            name: 'ProxyAdmin',
            chain: 'ethereum',
            description: 'Can upgrade contracts.',
            accounts: [
              {
                name: 'ProxyAdmin',
                address: permissionAddress,
                url: 'https://etherscan.io/address/0x3333#code',
                isVerified: false,
                type: 'Contract',
              },
            ],
          },
        ],
      },
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
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: '',
            chain: 'ethereum',
            address: contractAddress,
            isVerified: false,
          },
        ],
      },
    })

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
    const permissions = mockObject<Record<string, ProjectPermissions>>({
      ethereum: {
        roles: [],
        actors: [
          {
            id: '',
            name: '',
            chain: 'ethereum',
            description: 'Can upgrade contracts.',
            accounts: [
              {
                name: '0x3333...3333',
                address: permissionAddress,
                url: 'https://etherscan.io/address/0x3333#code',
                isVerified: false,
                type: 'Contract',
              },
            ],
          },
        ],
      },
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
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: 'Contract',
            chain: 'ethereum',
            address: contractAddress,
            isVerified: false,
          },
        ],
      },
    })

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
