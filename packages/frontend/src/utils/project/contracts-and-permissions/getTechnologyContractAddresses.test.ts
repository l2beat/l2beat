import type { ProjectContract } from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getTechnologyContractAddresses } from './getTechnologyContractAddresses'

describe(getTechnologyContractAddresses.name, () => {
  it('classifies immutable contracts without implementations as standalone', () => {
    const contract = mockObject<ProjectContract>({
      name: 'Verifier',
      chain: 'ethereum',
      address: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
      isVerified: false,
      url: 'https://etherscan.io/address/0x1111#code',
      upgradeability: {
        proxyType: 'immutable',
        immutable: true,
        admins: [],
        implementations: [],
      },
    })

    const result = getTechnologyContractAddresses(contract, undefined)

    expect(result.addresses[0]?.contractType).toEqual('standalone')
    expect(result.addresses[0]?.verificationStatus).toEqual('unverified')
  })

  it('classifies non-immutable proxies without implementations as proxies', () => {
    const contract = mockObject<ProjectContract>({
      name: 'Diamond',
      chain: 'ethereum',
      address: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
      isVerified: true,
      url: undefined,
      upgradeability: {
        proxyType: 'EIP2535 diamond proxy',
        admins: [],
        implementations: [],
      },
    })

    const result = getTechnologyContractAddresses(contract, undefined)

    expect(result.addresses[0]?.contractType).toEqual('proxy')
  })

  it('preserves verification status and explorer paths for every address', () => {
    const contract = mockObject<ProjectContract>({
      name: 'RollupProxy',
      chain: 'ethereum',
      address: ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      ),
      isVerified: true,
      url: 'https://explorer.example/l2/address/0x1111#code',
      upgradeability: {
        proxyType: 'EIP1967 proxy',
        admins: [
          {
            address: ChainSpecificAddress(
              'eth:0x4444444444444444444444444444444444444444',
            ),
            isVerified: false,
          },
        ],
        implementations: [
          {
            address: ChainSpecificAddress(
              'eth:0x2222222222222222222222222222222222222222',
            ),
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
    })

    const result = getTechnologyContractAddresses(contract, undefined)

    expect(
      result.addresses.map((address) => ({
        contractType: address.contractType,
        verificationStatus: address.verificationStatus,
        href: address.href,
      })),
    ).toEqual([
      {
        contractType: 'proxy',
        verificationStatus: 'verified',
        href: 'https://explorer.example/l2/address/0x1111111111111111111111111111111111111111#code',
      },
      {
        contractType: 'implementation',
        verificationStatus: 'unverified',
        href: 'https://explorer.example/l2/address/0x2222222222222222222222222222222222222222#code',
      },
      {
        contractType: 'implementation',
        verificationStatus: 'verified',
        href: 'https://explorer.example/l2/address/0x3333333333333333333333333333333333333333#code',
      },
    ])
    expect(result.admins[0]?.verificationStatus).toEqual('unverified')
  })
})
