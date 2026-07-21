import type { ProjectContracts, ProjectPermissions } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getUnverifiedContractEntries } from './getUnverifiedContractEntries'

describe(getUnverifiedContractEntries.name, () => {
  it('returns unverified contracts and permission accounts', () => {
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: 'StandaloneContract',
            chain: 'ethereum',
            address: ChainSpecificAddress(
              'eth:0x1111111111111111111111111111111111111111',
            ),
            isVerified: false,
            url: 'https://etherscan.io/address/0x1111#code',
          },
          {
            name: 'RollupProxy',
            chain: 'ethereum',
            address: ChainSpecificAddress(
              'eth:0x2222222222222222222222222222222222222222',
            ),
            isVerified: false,
            url: 'https://etherscan.io/address/0x2222#code',
            upgradeability: {
              proxyType: 'EIP1967 proxy',
              admins: [],
              implementations: [
                ChainSpecificAddress(
                  'eth:0x3333333333333333333333333333333333333333',
                ),
                ChainSpecificAddress(
                  'eth:0x4444444444444444444444444444444444444444',
                ),
              ],
              unverifiedImplementations: [
                ChainSpecificAddress(
                  'eth:0x4444444444444444444444444444444444444444',
                ),
              ],
            },
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
                address: ChainSpecificAddress(
                  'eth:0x5555555555555555555555555555555555555555',
                ),
                url: 'https://etherscan.io/address/0x5555#code',
                isVerified: false,
                type: 'Contract',
              },
            ],
          },
        ],
      },
    })

    const result = getUnverifiedContractEntries(contracts, permissions)

    expect(result).toEqual([
      {
        address: '0x1111111111111111111111111111111111111111',
        contractName: 'StandaloneContract',
        href: 'https://etherscan.io/address/0x1111#code',
        targetId: 'StandaloneContract',
        type: 'standalone',
      },
      {
        address: '0x2222222222222222222222222222222222222222',
        contractName: 'RollupProxy',
        href: 'https://etherscan.io/address/0x2222#code',
        targetId: 'RollupProxy',
        type: 'proxy',
      },
      {
        address: '0x4444444444444444444444444444444444444444',
        contractName: 'RollupProxy',
        href: 'https://etherscan.io/address/0x4444444444444444444444444444444444444444#code',
        targetId: 'RollupProxy',
        type: 'implementation',
      },
      {
        address: '0x5555555555555555555555555555555555555555',
        contractName: 'ProxyAdmin',
        href: 'https://etherscan.io/address/0x5555#code',
        targetId: 'ProxyAdmin',
        type: 'permission',
      },
    ])
  })
})
