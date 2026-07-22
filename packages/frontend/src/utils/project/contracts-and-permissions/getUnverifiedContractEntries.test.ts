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
        target: { id: 'RollupProxy', label: 'RollupProxy' },
      },
      {
        address: permissionAddress,
        target: { id: 'ProxyAdmin', label: 'ProxyAdmin' },
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

  it('does not create section links from empty ids', () => {
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

    expect(result).toEqual([{ address: contractAddress, target: undefined }])
  })
})
