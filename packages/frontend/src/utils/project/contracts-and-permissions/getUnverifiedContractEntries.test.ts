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
            name: 'RollupProxy',
            chain: 'ethereum',
            address: ChainSpecificAddress(
              'eth:0x1111111111111111111111111111111111111111',
            ),
            isVerified: false,
            url: 'https://etherscan.io/address/0x1111#code',
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
                  'eth:0x3333333333333333333333333333333333333333',
                ),
                url: 'https://etherscan.io/address/0x3333#code',
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
        contractName: 'RollupProxy',
        href: 'https://etherscan.io/address/0x1111#code',
        targetId: 'RollupProxy',
      },
      {
        address: '0x3333333333333333333333333333333333333333',
        contractName: 'ProxyAdmin',
        href: 'https://etherscan.io/address/0x3333#code',
        targetId: 'ProxyAdmin',
      },
    ])
  })
})
