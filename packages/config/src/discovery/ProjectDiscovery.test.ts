import {
  type ConfigReader,
  ConfigRegistry,
  type DiscoveryConfig,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { contractStub, discoveredJsonStub } from '../test/stubs/discoveredJson'
import { ProjectDiscovery } from './ProjectDiscovery'

describe(ProjectDiscovery.name, () => {
  const projectName = 'ExampleProject'
  const configReader = mockObject<ConfigReader>({
    readConfig: (projectName: string, chain: string) =>
      mockConfig(projectName, chain),
    readDiscovery: () => discoveredJsonStub,
    readAllDiscoveredChainsForProject: mockFn().returns(['ethereum']),
  })

  const discovery = new ProjectDiscovery(projectName, configReader)

  describe(ProjectDiscovery.prototype.getContract.name, () => {
    it('should return contract for given address', () => {
      const contract = discovery.getContract(contractStub.address.toString())

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract with given address does not exist', () => {
      const nonExistingAddress = ChainSpecificAddress(
        'eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575',
      )

      expect(() => discovery.getContract(nonExistingAddress)).toThrow(
        `Assertion Error: No contract of ${nonExistingAddress} address found (${projectName})`,
      )
    })

    it('should return contract for given name', () => {
      assert(contractStub.name !== undefined)
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
      assert(contractStub.name !== undefined)
      const value = discovery.getContractValue(
        contractStub.name,
        'CHILD_BLOCK_INTERVAL',
      )
      expect(value).toEqual(contractStub.values?.CHILD_BLOCK_INTERVAL as number)
    })

    it('should throw an error if given contract value does not exist', () => {
      assert(contractStub.name !== undefined)
      const name = contractStub.name
      const key = 'randomValue'
      expect(() => discovery.getContractValue(name, key)).toThrow(
        `Assertion Error: Value of key ${key} does not exist in ${contractStub.name} contract (${projectName})`,
      )
    })
  })

  it('reads configurations for different chainIds', () => {
    const discovery = new ProjectDiscovery('ExampleProject', configReader)
    const contract = discovery.getContract(contractStub.address.toString())

    expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
  })

  describe(ProjectDiscovery.prototype.getPermissionsByRole.name, () => {
    it('should find contracts and eoas by role', () => {
      const discovery = new ProjectDiscovery('ExampleProject', configReader)
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
          address: ChainSpecificAddress(
            'eth:0x000000000000000000000000000000000000Bb22',
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
        'Can be updated by eth:0x0D4C1222f5e839a911e2053860e45F18921D72ac, eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
      expect(replaced).toEqual(
        'Can be updated by MockedContract, 0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
    })
  })
})

function mockConfig(
  name: string,
  chain = 'ethereum',
  innerConfig: Partial<DiscoveryConfig> = {},
): ConfigRegistry {
  return new ConfigRegistry({
    name,
    chain,
    initialAddresses: [],
    ...innerConfig,
  })
}
