import { expect, mockObject } from 'earljs'

import {
  contractStub,
  discoveredJsonStub,
} from '../../test/stubs/discoveredJson'
import { Filesystem, ProjectDiscovery } from './ProjectDiscovery'

describe(ProjectDiscovery.name, () => {
  const fsMock = mockObject<Filesystem>({
    readFileSync: () => JSON.stringify(discoveredJsonStub),
  })
  const projectName = 'ExampleProject'
  const discovery = new ProjectDiscovery('ExampleProject', fsMock)

  describe(ProjectDiscovery.prototype.getContract.name, () => {
    it('should return contract for given address', () => {
      const contract = discovery.getContract(contractStub.address)

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
        `Assertion Error: Found more than one contracts or no contract of ${name} name found (${projectName})`,
      )
    })

    it('should throw an error if there is more than one contract with given name', () => {
      const name = 'PaymentExitGame'

      expect(() => discovery.getContract(name)).toThrow(
        `Assertion Error: Found more than one contracts or no contract of ${name} name found (${projectName})`,
      )
    })
  })

  describe(ProjectDiscovery.prototype.getContractValue.name, () => {
    it('should return given contract value', () => {
      const value = discovery.getContractValue<number>(
        contractStub.name,
        'CHILD_BLOCK_INTERVAL',
      )
      expect(value).toEqual(contractStub.values.CHILD_BLOCK_INTERVAL)
    })

    it('should throw an error if given contract value does not exist', () => {
      const key = 'randomValue'
      expect(() => discovery.getContractValue(contractStub.name, key)).toThrow(
        `Assertion Error: Value of key ${key} does not exist in ${contractStub.name} contract (${projectName})`,
      )
    })
  })

  describe(
    ProjectDiscovery.prototype.getContractUpgradeabilityParam.name,
    () => {
      it('should return given upgradeability param', () => {
        const upgradeabilityParam = discovery.getContractUpgradeabilityParam(
          contractStub.name,
          'type',
        )

        expect(upgradeabilityParam).toEqual('immutable')
      })
      it('should throw an error if upgradeability param does not exist', () => {
        const key = 'randomParam'

        expect(() =>
          discovery.getContractUpgradeabilityParam(
            contractStub.name,
            //@ts-expect-error key does not exist on UpgradeabilityParams type
            key,
          ),
        ).toThrow(
          `Assertion Error: Upgradeability param of key ${key} does not exist in ${contractStub.name} contract (${projectName})`,
        )
      })
    },
  )
})
