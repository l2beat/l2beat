import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'
import type { ContractsSection } from './getContractsSection'
import type { PermissionSection } from './getPermissionsSection'
import {
  getUnverifiedContractEntries,
  hasCompleteUnverifiedContractEntries,
} from './getUnverifiedContractEntries'

describe(getUnverifiedContractEntries.name, () => {
  it('returns the unverified addresses from contract and permission sections', () => {
    const standalone = mockObject<TechnologyContract>({
      id: 'StandaloneContract',
      name: 'StandaloneContract',
      chain: 'ethereum',
      addresses: [
        {
          name: '0x1111…1111',
          address: '0x1111111111111111111111111111111111111111',
          href: 'https://etherscan.io/address/0x1111#code',
          verificationStatus: 'unverified',
          contractType: 'standalone',
        },
      ],
      admins: [],
    })
    const proxy = mockObject<TechnologyContract>({
      id: 'RollupProxy',
      name: 'RollupProxy',
      chain: 'ethereum',
      addresses: [
        {
          name: '0x2222…2222',
          address: '0x2222222222222222222222222222222222222222',
          href: 'https://etherscan.io/address/0x2222#code',
          verificationStatus: 'unverified',
          contractType: 'proxy',
        },
        {
          name: 'Implementation #1',
          address: '0x3333333333333333333333333333333333333333',
          href: 'https://etherscan.io/address/0x3333#code',
          verificationStatus: 'verified',
          contractType: 'implementation',
        },
        {
          name: 'Implementation #2',
          address: '0x4444444444444444444444444444444444444444',
          href: 'https://etherscan.io/address/0x4444#code',
          verificationStatus: 'unverified',
          contractType: 'implementation',
        },
      ],
      admins: [],
    })
    const permission = mockObject<TechnologyContract>({
      id: 'ProxyAdmin',
      name: 'ProxyAdmin',
      chain: 'ethereum',
      addresses: [
        {
          name: '0x5555…5555',
          address: '0x5555555555555555555555555555555555555555',
          href: 'https://etherscan.io/address/0x5555#code',
          verificationStatus: 'unverified',
        },
      ],
      admins: [],
    })
    const contractsSection = mockObject<ContractsSection>({
      contracts: { Ethereum: [standalone, proxy] },
    })
    const permissionsSection = mockObject<PermissionSection>({
      permissionsByChain: {
        Ethereum: { roles: [], actors: [permission] },
      },
    })

    const result = getUnverifiedContractEntries(
      contractsSection,
      permissionsSection,
    )

    expect(result).toEqual([
      {
        address: '0x1111111111111111111111111111111111111111',
        chain: 'ethereum',
        contractName: 'StandaloneContract',
        href: 'https://etherscan.io/address/0x1111#code',
        targetId: 'StandaloneContract',
        type: 'standalone',
      },
      {
        address: '0x2222222222222222222222222222222222222222',
        chain: 'ethereum',
        contractName: 'RollupProxy',
        href: 'https://etherscan.io/address/0x2222#code',
        targetId: 'RollupProxy',
        type: 'proxy',
      },
      {
        address: '0x4444444444444444444444444444444444444444',
        chain: 'ethereum',
        contractName: 'RollupProxy',
        href: 'https://etherscan.io/address/0x4444#code',
        targetId: 'RollupProxy',
        type: 'implementation',
      },
      {
        address: '0x5555555555555555555555555555555555555555',
        chain: 'ethereum',
        contractName: 'ProxyAdmin',
        href: 'https://etherscan.io/address/0x5555#code',
        targetId: 'ProxyAdmin',
        type: 'permission',
      },
    ])

    const matchingContracts = [
      ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111'),
      ChainSpecificAddress('eth:0x2222222222222222222222222222222222222222'),
      ChainSpecificAddress('eth:0x4444444444444444444444444444444444444444'),
      ChainSpecificAddress('eth:0x5555555555555555555555555555555555555555'),
      ChainSpecificAddress('eth:0x1111111111111111111111111111111111111111'),
    ]
    expect(
      hasCompleteUnverifiedContractEntries(result, matchingContracts),
    ).toEqual(true)

    const externalContract = ChainSpecificAddress(
      'arb1:0x1111111111111111111111111111111111111111',
    )
    expect(
      hasCompleteUnverifiedContractEntries(result, [
        ...matchingContracts,
        externalContract,
      ]),
    ).toEqual(false)
  })
})
