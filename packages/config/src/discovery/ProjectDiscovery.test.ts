import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import {
  type ConfigReader,
  DiscoveryConfig,
  type RawDiscoveryConfig,
} from '@l2beat/discovery'
import { contractStub, discoveredJsonStub } from '../test/stubs/discoveredJson'
import {
  ProjectDiscovery,
  formatAsBulletPoints,
  trimTrailingDots,
} from './ProjectDiscovery'

describe(ProjectDiscovery.name, () => {
  const projectName = 'ExampleProject'
  const configReader = mockObject<ConfigReader>({
    readConfig: (projectName: string, chain: string) =>
      mockConfig(projectName, chain),
    readDiscovery: () => discoveredJsonStub,
  })

  const discovery = new ProjectDiscovery(projectName, 'ethereum', configReader)

  describe(ProjectDiscovery.prototype.getContract.name, () => {
    it('should return contract for given address', () => {
      const contract = discovery.getContract(contractStub.address.toString())

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract with given address does not exist', () => {
      const nonExistingAddress = '0xF380166F8490F24AF32Bf47D1aA217FBA62B6575'

      expect(() => discovery.getContract(nonExistingAddress)).toThrow(
        `Assertion Error: No contract of ${nonExistingAddress} address found (${projectName})`,
      )
    })

    it('should return contract for given name', () => {
      const contract = discovery.getContract(contractStub.name)

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract for given name does not exist', () => {
      const name = 'randomContract'

      expect(() => discovery.getContract(name)).toThrow(
        `Assertion Error: Found no contract of ${name} name (${projectName})`,
      )
    })

    it('should throw an error if there is more than one contract with given name', () => {
      const name = 'DuplicatedNameContractMock'

      expect(() => discovery.getContract(name)).toThrow(
        `Assertion Error: Found more than one contracts of ${name} name (${projectName})`,
      )
    })
  })

  describe(ProjectDiscovery.prototype.getContractValue.name, () => {
    it('should return given contract value', () => {
      const value = discovery.getContractValue(
        contractStub.name,
        'CHILD_BLOCK_INTERVAL',
      )
      expect(value).toEqual(contractStub.values?.CHILD_BLOCK_INTERVAL as number)
    })

    it('should throw an error if given contract value does not exist', () => {
      const key = 'randomValue'
      expect(() => discovery.getContractValue(contractStub.name, key)).toThrow(
        `Assertion Error: Value of key ${key} does not exist in ${contractStub.name} contract (${projectName})`,
      )
    })
  })

  it('reads configurations for different chainIds', () => {
    const discovery = new ProjectDiscovery(
      'ExampleProject',
      'arbitrum',
      configReader,
    )
    const contract = discovery.getContract(contractStub.address.toString())

    expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
  })

  describe(ProjectDiscovery.prototype.getPermissionsByRole.name, () => {
    it('should find contracts and eoas by role', () => {
      const discovery = new ProjectDiscovery(
        'ExampleProject',
        'ethereum',
        configReader,
      )
      const sequencers = discovery.getPermissionsByRole('sequence')
      expect(sequencers).toEqual([
        {
          address: contractStub.address,
          type: 'Contract',
          isVerified: true,
          name: '0x0D4C…72ac',
          url: 'https://etherscan.io/address/0x0D4C1222f5e839a911e2053860e45F18921D72ac',
        },
        {
          address: EthereumAddress(
            '0x000000000000000000000000000000000000Bb22',
          ),
          type: 'EOA',
          isVerified: true,
          name: '0x0000…Bb22',
          url: 'https://etherscan.io/address/0x000000000000000000000000000000000000Bb22',
        },
      ])
    })
  })

  describe(ProjectDiscovery.prototype.replaceAddressesWithNames.name, () => {
    it('should replace addresses with names', () => {
      const replaced = discovery.replaceAddressesWithNames(
        'Can be updated by 0x0D4C1222f5e839a911e2053860e45F18921D72ac, 0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
      expect(replaced).toEqual(
        'Can be updated by MockedContract, 0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
    })
  })
})

describe(formatAsBulletPoints.name, () => {
  it('should format description as bullet points', () => {
    const description = ['First point', 'Second point', 'Third point']
    const formatted = formatAsBulletPoints(description)
    expect(formatted).toEqual('* First point\n* Second point\n* Third point\n')
  })

  it('should format single point as string', () => {
    const description = ['Single point']
    const formatted = formatAsBulletPoints(description)
    expect(formatted).toEqual('Single point')
  })
})

describe(trimTrailingDots.name, () => {
  it('should remove trailing dots', () => {
    const description = 'Some description...'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toEqual('Some description')
  })

  it('should not remove trailing dots if there are no dots', () => {
    const description = 'Some description'
    const trimmed = trimTrailingDots(description)
    expect(trimmed).toEqual(description)
  })
})

function mockConfig(
  name: string,
  chain = 'ethereum',
  innerConfig: Partial<RawDiscoveryConfig> = {},
): DiscoveryConfig {
  return new DiscoveryConfig({
    name,
    chain,
    initialAddresses: [],
    ...innerConfig,
  })
}
