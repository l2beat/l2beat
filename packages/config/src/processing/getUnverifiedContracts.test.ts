import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ScalingProject } from '../internalTypes'
import type {
  BaseProject,
  ProjectContracts,
  ProjectEscrow,
  ProjectScalingDa,
} from '../types'
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

  it('includes unverified escrow implementations', () => {
    const unverifiedImplementation = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const escrow = mockObject<ProjectEscrow>({
      chain: 'ethereum',
      address: EthereumAddress('0x1111111111111111111111111111111111111111'),
      contract: {
        name: 'EscrowProxy',
        chain: 'ethereum',
        isVerified: true,
        upgradeability: {
          proxyType: 'EIP1967 proxy',
          admins: [],
          implementations: [
            { address: unverifiedImplementation, isVerified: false },
          ],
        },
      },
    })
    const project = mockObject<ScalingProject>({
      type: 'layer2',
      config: mockObject<ScalingProject['config']>({ escrows: [escrow] }),
      contracts: undefined,
      permissions: undefined,
    })

    const result = getProjectUnverifiedContracts(project)

    expect(result).toEqual([unverifiedImplementation])
  })

  it('includes unverified DA bridge implementations', () => {
    const daBridgeId = ProjectId('da-bridge')
    const unverifiedImplementation = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          {
            name: 'DaBridgeProxy',
            chain: 'ethereum',
            address: ChainSpecificAddress(
              'eth:0x1111111111111111111111111111111111111111',
            ),
            isVerified: true,
            upgradeability: {
              proxyType: 'EIP1967 proxy',
              admins: [],
              implementations: [
                { address: unverifiedImplementation, isVerified: false },
              ],
            },
          },
        ],
      },
    })
    const daBridge = mockObject<BaseProject>({
      id: daBridgeId,
      contracts,
      permissions: undefined,
    })
    const dataAvailability = mockObject<ProjectScalingDa>({
      bridge: mockObject<ProjectScalingDa['bridge']>({
        projectId: daBridgeId,
      }),
    })
    const project = mockObject<ScalingProject>({
      type: 'layer2',
      hostChain: undefined,
      config: mockObject<ScalingProject['config']>({ escrows: [] }),
      contracts: undefined,
      permissions: undefined,
      dataAvailability,
    })

    const result = getProjectUnverifiedContracts(project, [daBridge])

    expect(result).toEqual([unverifiedImplementation])
  })
})
