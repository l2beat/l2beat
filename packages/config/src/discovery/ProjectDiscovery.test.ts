import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { contractStub, discoveredJsonStub } from '../test/stubs/discoveredJson'
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

      it('should not throw an error if upgradeability param is 0', () => {
        const key = 'zeroUpgradeabilityParam'

        const upgradeabilityParam = discovery.getContractUpgradeabilityParam(
          contractStub.name,
          //@ts-expect-error key does not exist on UpgradeabilityParams type
          key,
        )

        expect(upgradeabilityParam).toEqual(0)
      })
    },
  )

  describe(ProjectDiscovery.prototype.getMultisigPermission.name, () => {
    it('should return given permissions and avoid infite loop', () => {
      const permissions = discovery.getMultisigPermission(
        'TopMultisigMock',
        'This is a top multisig',
      )

      expect(permissions).toEqual([
        {
          accounts: [
            {
              address: EthereumAddress(
                '0x344DddaDd2b96ef51700574204806F25bc9a23C0',
              ),
              type: 'MultiSig',
            },
          ],
          description:
            'This is a top multisig This is a Gnosis Safe with 3 / 4 threshold.',
          name: 'TopMultisigMock',
        },
        {
          accounts: [
            {
              address: EthereumAddress(
                '0xA4878f0E143Dad8eB8999f079fDF319988bc6EB2',
              ),
              type: 'Contract',
            },
            {
              address: EthereumAddress(
                '0x7d2C8AB5bf6F0D72BD255e65cA98cCb0773c2F0b',
              ),
              type: 'Contract',
            },
            {
              address: EthereumAddress(
                '0x4C6ebdEf6E8B6c9913B3FEb6ACBf8177eFcc92B3',
              ),
              type: 'Contract',
            },
            {
              address: EthereumAddress(
                '0x4203A72C772ed980694bCEd929D982D5859d34FF',
              ),
              type: 'MultiSig',
            },
          ],
          description: 'Those are the participants of the TopMultisigMock.',
          name: 'TopMultisigMock participants',
          references: undefined,
        },
        {
          accounts: [
            {
              address: EthereumAddress(
                '0x4203A72C772ed980694bCEd929D982D5859d34FF',
              ),
              type: 'MultiSig',
            },
          ],
          description:
            'Multisig member, itself a multisig. This is a Gnosis Safe with 2 / 2 threshold.',
          name: 'RecursiveMultisigMock',
        },
        {
          accounts: [
            {
              address: EthereumAddress(
                '0x690698362E12b370053C0D1cED9aD179115d7fbD',
              ),
              type: 'Contract',
            },
            {
              address: EthereumAddress(
                '0x344DddaDd2b96ef51700574204806F25bc9a23C0',
              ),
              type: 'MultiSig',
            },
          ],
          description:
            'Those are the participants of the RecursiveMultisigMock.',
          name: 'RecursiveMultisigMock participants',
          references: undefined,
        },
      ])
    })
  })
})
