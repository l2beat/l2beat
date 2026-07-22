import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { BaseProject, ProjectContracts } from '../types'
import { getProjectUnverifiedContracts } from './getUnverifiedContracts'

describe(getProjectUnverifiedContracts.name, () => {
  it('includes unverified implementations', () => {
    const unverifiedImplementation = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: 'Proxy',
            chain: 'ethereum',
            address: ChainSpecificAddress(
              'eth:0x1111111111111111111111111111111111111111',
            ),
            isVerified: true,
            upgradeability: {
              proxyType: 'EIP1967 proxy',
              admins: [],
              implementations: [
                {
                  address: unverifiedImplementation,
                  isVerified: false,
                },
                {
                  address: ChainSpecificAddress(
                    'eth:0x3333333333333333333333333333333333333333',
                  ),
                  isVerified: true,
                },
              ],
            },
          },
        ],
      },
    })
    const project = mockObject<BaseProject>({
      contracts,
      permissions: undefined,
    })

    const result = getProjectUnverifiedContracts(project)

    expect(result).toEqual([unverifiedImplementation])
  })
})
