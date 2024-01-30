import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import {
  contractStub,
  discoveredJsonStub,
  discoveredOpStackJsonStub,
} from '../test/stubs/discoveredJson'
import { Filesystem, ProjectDiscovery } from './ProjectDiscovery'

describe(ProjectDiscovery.name, () => {
  const fsMock = mockObject<Filesystem>({
    readFileSync: () => JSON.stringify(discoveredJsonStub),
  })
  const projectName = 'ExampleProject'
  const discovery = new ProjectDiscovery('ExampleProject', 'ethereum', fsMock)

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

  describe(ProjectDiscovery.prototype.getOpStackContractDetails.name, () => {
    const fsMock = mockObject<Filesystem>({
      readFileSync: () => JSON.stringify(discoveredOpStackJsonStub),
    })
    const discovery = new ProjectDiscovery('ExampleProject', 'ethereum', fsMock)

    const upgradesProxy = {
      upgradableBy: ['MockAdmin'],
      upgradeDelay: 'No delay',
    }

    it('should return all op stack contracts with details and correct overrides', () => {
      const contractDetails = discovery.getOpStackContractDetails(
        upgradesProxy,
        { OptimismPortal: 'MockPortal' },
      )

      expect(contractDetails).toEqual([
        {
          address: EthereumAddress(
            '0x48d7A6bbc428bca019A560cF3e8EA5364395Aad3',
          ),
          description:
            'The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.',
          name: 'L2OutputOracle',
          chain: 'ethereum',
          upgradableBy: ['MockAdmin'],
          upgradeDelay: 'No delay',
          upgradeability: {
            admin: EthereumAddress(
              '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
            ),
            implementation: EthereumAddress(
              '0x29510c3ac0248bBE92FDb57bd2cBAF7216cC217a',
            ),
            type: 'EIP1967 proxy',
          },
        },
        {
          address: EthereumAddress(
            '0x0a2CCDbBD00f61724C485518B940Ab25abe832aA',
          ),
          description:
            'The MockPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
          name: 'MockPortal',
          chain: 'ethereum',
          upgradableBy: ['MockAdmin'],
          upgradeDelay: 'No delay',
          upgradeability: {
            admin: EthereumAddress(
              '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
            ),
            implementation: EthereumAddress(
              '0x1b927019071A2a9C2b852Fd36f7238D2376B82FA',
            ),
            type: 'EIP1967 proxy',
          },
        },
        {
          address: EthereumAddress(
            '0x6Dda3a70B9946fA8C015904d9E2BEC86ecE4E745',
          ),
          description:
            'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
          name: 'SystemConfig',
          chain: 'ethereum',
          upgradableBy: ['MockAdmin'],
          upgradeDelay: 'No delay',
          upgradeability: {
            admin: EthereumAddress(
              '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
            ),
            implementation: EthereumAddress(
              '0xeba2dc4CC210e885F60b5feA41FDEab0C6527fdc',
            ),
            type: 'EIP1967 proxy',
          },
        },
        {
          address: EthereumAddress(
            '0x17bFa0561d9Ae73e05EcEAEB6663aDc85fA1d3E2',
          ),
          description:
            "The L1CrossDomainMessenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
          name: 'L1CrossDomainMessenger',
          chain: 'ethereum',
          upgradableBy: ['MockAdmin'],
          upgradeDelay: 'No delay',
          upgradeability: {
            addressManager: EthereumAddress(
              '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
            ),
            implementation: EthereumAddress(
              '0x2150Bc3c64cbfDDbaC9815EF615D6AB8671bfe43',
            ),
            implementationName: 'OVM_L1CrossDomainMessenger',
            type: 'resolved delegate proxy',
          },
        },
        {
          address: EthereumAddress(
            '0xeBec795c9c8bBD61FFc14A6662944748F299cAcf',
          ),
          description:
            'The L1StandardBridge contract is the main entry point to deposit ERC20 tokens from L1 to L2.',
          name: 'L1StandardBridge',
          chain: 'ethereum',
          upgradableBy: ['MockAdmin'],
          upgradeDelay: 'No delay',
          upgradeability: {
            type: 'EIP1967 proxy',
            implementation: EthereumAddress(
              '0xC70dcb11c0673b0BBE2F415105fA2B15Ac58339f',
            ),
            admin: EthereumAddress(
              '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
            ),
          },
        },
      ])
    })
  })

  describe(ProjectDiscovery.prototype.getOpStackPermissions.name, () => {
    const fsMock = mockObject<Filesystem>({
      readFileSync: () => JSON.stringify(discoveredOpStackJsonStub),
    })
    const discovery = new ProjectDiscovery('ExampleProject', 'ethereum', fsMock)

    it('should return all op stack permissions with correct overrides', () => {
      const permissions = discovery.getOpStackPermissions()

      expect(permissions).toEqual([
        {
          accounts: [
            {
              address: EthereumAddress(
                '0x543bA4AADBAb8f9025686Bd03993043599c6fB04',
              ),
              type: 'Contract',
            },
          ],
          description:
            'Admin of SystemConfig, L2OutputOracle, L1StandardBridge.',
          name: 'ProxyAdmin',
          chain: 'ethereum',
        },
      ])
    })
  })

  it('reads configurations for different chainIds', () => {
    const fsMock = mockObject<Filesystem>({
      readFileSync: () => JSON.stringify(discoveredJsonStub),
    })
    const discovery = new ProjectDiscovery('ExampleProject', 'arbitrum', fsMock)
    const contract = discovery.getContract(contractStub.address)

    expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    expect(fsMock.readFileSync).toHaveBeenNthCalledWith(
      1,
      expect.includes('/ExampleProject/arbitrum/'),
    )
  })
})
