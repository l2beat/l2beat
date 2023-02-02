import { mock } from '@l2beat/common'
import { expect } from 'earljs'
import {
  contractStub,
  discoveredJsonStub,
} from '../../test/stubs/discoveredJson'
import { Filesystem, ProjectDiscovery } from './ProjectDiscovery'

describe.only(ProjectDiscovery.name, () => {
  const fsMock = mock<Filesystem>({
    readFileSync: () => JSON.stringify(discoveredJsonStub),
  })
  const discovery = new ProjectDiscovery('does not matter', fsMock)

  describe(ProjectDiscovery.prototype.getContract.name, () => {
    it('should return contract for given address', () => {
      const contract = discovery.getContract(contractStub.address)

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract with given address does not exist', () => {
      expect(() =>
        discovery.getContract('0x10A0C2674881Af5241E4d1046Da1bE118fF736fF'),
      ).toThrow(Error)
    })

    it('should return contract for given name', () => {
      const contract = discovery.getContract(contractStub.name)

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract for given name does not exist', () => {
      const name = 'randomContract'

      expect(() => discovery.getContract(name)).toThrow(Error)
    })

    it('should throw an error if there is more than one contract with given name', () => {
      const name = 'PaymentExitGame'

      expect(() => discovery.getContract(name)).toThrow(Error)
    })
  })

  describe(ProjectDiscovery.prototype.getContractValue.name, () => {
    it('should return given contract value', () => {
      const value = discovery.getContractValue<number>(
        contractStub.name,
        'CHILD_BLOCK_INTERVAL',
      )
      expect(value).toEqual(contractStub.values.CHILD_BLOCK_INTERVAL!)
    })

    it('should throw an error if given contract value does not exist', () => {
      expect(() =>
        discovery.getContractValue(contractStub.name, 'randomValue'),
      ).toThrow(Error)
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
        expect(() =>
          discovery.getContractUpgradeabilityParam(
            contractStub.name,
            //@ts-expect-error key does not exist on UpgradeabilityParams type
            'randomParam',
          ),
        ).toThrow(Error)
      })
    },
  )
})
