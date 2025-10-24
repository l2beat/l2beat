import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { CrossChainAccessControlHandler } from './CrossChainAccessControlHandler'

describe(CrossChainAccessControlHandler.name, () => {
  const abi = new utils.Interface([
    'event RoleGranted(address indexed chainAddress, bytes32 indexed role, address indexed account)',
    'event RoleRevoked(address indexed chainAddress, bytes32 indexed role, address indexed account)',
    'event RoleAdminChanged(address indexed chainAddress, bytes32 indexed role, bytes32 previousAdminRole, bytes32 newAdminRole)',
  ])

  function RoleGranted(
    chainAddress: EthereumAddress,
    role: string,
    account: EthereumAddress,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleGranted'), [
      chainAddress,
      role,
      account,
    ]) as providers.Log
  }

  function RoleRevoked(
    chainAddress: EthereumAddress,
    role: string,
    account: EthereumAddress,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleRevoked'), [
      chainAddress,
      role,
      account,
    ]) as providers.Log
  }

  function RoleAdminChanged(
    chainAddress: EthereumAddress,
    role: string,
    adminRole: string,
  ): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleAdminChanged'), [
      chainAddress,
      role,
      '0x' + '0'.repeat(64),
      adminRole,
    ]) as providers.Log
  }

  describe('getValue filtering', () => {
    const WIZARD_ROLE = utils.solidityKeccak256(['string'], ['WIZARD_ROLE'])
    const WARRIOR_ROLE = utils.solidityKeccak256(['string'], ['WARRIOR_ROLE'])

    const Alice = ChainSpecificAddress.random()
    const Bob = ChainSpecificAddress.random()
    const Charlie = ChainSpecificAddress.random()

    const Chain1 = ChainSpecificAddress.fromLong(
      'ethereum',
      '0x' + '1'.repeat(40),
    )
    const Chain2 = ChainSpecificAddress.fromLong(
      'ethereum',
      '0x' + '2'.repeat(40),
    )

    const Chain1Raw = EthereumAddress.unsafe('0x' + '1'.repeat(40))
    const Chain2Raw = EthereumAddress.unsafe('0x' + '2'.repeat(40))

    const AliceRaw = ChainSpecificAddress.address(Alice)
    const BobRaw = ChainSpecificAddress.address(Bob)
    const CharlieRaw = ChainSpecificAddress.address(Charlie)

    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async getLogs() {
        return [
          // Chain 1
          RoleGranted(Chain1Raw, WIZARD_ROLE, AliceRaw),
          RoleGranted(Chain1Raw, WARRIOR_ROLE, BobRaw),
          RoleGranted(Chain1Raw, WARRIOR_ROLE, CharlieRaw),
          RoleAdminChanged(Chain1Raw, WARRIOR_ROLE, WIZARD_ROLE),
          // Chain 2
          RoleGranted(Chain2Raw, WIZARD_ROLE, BobRaw),
          RoleGranted(Chain2Raw, WIZARD_ROLE, CharlieRaw),
          RoleGranted(Chain2Raw, WARRIOR_ROLE, AliceRaw),
        ]
      },
    })

    it('Case 1: both pickChainAddress and pickRoleMembers specified', async () => {
      const handler = new CrossChainAccessControlHandler(
        'someName',
        {
          type: 'crossChainAccessControl',
          roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' },
          chainAddressNames: { [Chain1.toString()]: 'Chain1' },
          pickChainAddress: 'Chain1',
          pickRoleMembers: 'WIZARD_ROLE',
        },
        ['function WARRIOR_ROLE() view returns (bytes32)'],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: [Alice.toString()],
        ignoreRelative: undefined,
      })
    })

    it('Case 2: only pickChainAddress specified', async () => {
      const handler = new CrossChainAccessControlHandler(
        'someName',
        {
          type: 'crossChainAccessControl',
          roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' },
          chainAddressNames: { [Chain1.toString()]: 'Chain1' },
          pickChainAddress: 'Chain1',
        },
        ['function WARRIOR_ROLE() view returns (bytes32)'],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: {
          WIZARD_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [Alice.toString()],
          },
          WARRIOR_ROLE: {
            adminRole: 'WIZARD_ROLE',
            members: [Bob.toString(), Charlie.toString()],
          },
        },
        ignoreRelative: undefined,
      })
    })

    it('Case 3: only pickRoleMembers specified', async () => {
      const handler = new CrossChainAccessControlHandler(
        'someName',
        {
          type: 'crossChainAccessControl',
          roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' },
          chainAddressNames: {
            [Chain1.toString()]: 'Chain1',
            [Chain2.toString()]: 'Chain2',
          },
          pickRoleMembers: 'WIZARD_ROLE',
        },
        ['function WARRIOR_ROLE() view returns (bytes32)'],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: {
          Chain1: [Alice.toString()],
          Chain2: [Bob.toString(), Charlie.toString()],
        },
        ignoreRelative: undefined,
      })
    })

    it('Case 4: no filters specified', async () => {
      const handler = new CrossChainAccessControlHandler(
        'someName',
        {
          type: 'crossChainAccessControl',
          roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' },
          chainAddressNames: {
            [Chain1.toString()]: 'Chain1',
            [Chain2.toString()]: 'Chain2',
          },
        },
        ['function WARRIOR_ROLE() view returns (bytes32)'],
      )
      const value = await handler.execute(provider, address)
      expect(value).toEqual({
        field: 'someName',
        value: {
          Chain1: {
            WIZARD_ROLE: {
              adminRole: 'DEFAULT_ADMIN_ROLE',
              members: [Alice.toString()],
            },
            WARRIOR_ROLE: {
              adminRole: 'WIZARD_ROLE',
              members: [Bob.toString(), Charlie.toString()],
            },
          },
          Chain2: {
            WIZARD_ROLE: {
              adminRole: 'DEFAULT_ADMIN_ROLE',
              members: [Bob.toString(), Charlie.toString()],
            },
            WARRIOR_ROLE: {
              adminRole: 'DEFAULT_ADMIN_ROLE',
              members: [Alice.toString()],
            },
          },
        },
        ignoreRelative: undefined,
      })
    })
  })

  it('no logs', async () => {
    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async getLogs(providedAddress, topics) {
        expect(providedAddress).toEqual(address)
        expect(topics).toEqual([
          [
            abi.getEventTopic('RoleGranted'),
            abi.getEventTopic('RoleRevoked'),
            abi.getEventTopic('RoleAdminChanged'),
          ],
        ])
        return []
      },
    })

    const handler = new CrossChainAccessControlHandler(
      'someName',
      {
        type: 'crossChainAccessControl',
      },
      [],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {},
      ignoreRelative: undefined,
    })
  })

  it('passes relative ignore', async () => {
    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      async getLogs() {
        return []
      },
    })

    const handler = new CrossChainAccessControlHandler(
      'someName',
      {
        type: 'crossChainAccessControl',
        ignoreRelative: true,
      },
      [],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {},
      ignoreRelative: true,
    })
  })

  it('many logs across multiple chains', async () => {
    const WIZARD_ROLE = utils.solidityKeccak256(['string'], ['WIZARD_ROLE'])
    const WARRIOR_ROLE = utils.solidityKeccak256(['string'], ['WARRIOR_ROLE'])
    const ROGUE_ROLE = utils.solidityKeccak256(['string'], ['ROGUE_ROLE'])

    const Alice = ChainSpecificAddress.random()
    const Bob = ChainSpecificAddress.random()
    const Charlie = ChainSpecificAddress.random()

    const AliceRaw = ChainSpecificAddress.address(Alice)
    const BobRaw = ChainSpecificAddress.address(Bob)
    const CharlieRaw = ChainSpecificAddress.address(Charlie)

    const Chain1 = EthereumAddress.unsafe('0x' + '1'.repeat(40))
    const Chain2 = EthereumAddress.unsafe('0x' + '2'.repeat(40))

    const Chain1Long = ChainSpecificAddress.fromLong('ethereum', Chain1)
    const Chain2Long = ChainSpecificAddress.fromLong('ethereum', Chain2)

    const address = ChainSpecificAddress.random()
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async getLogs() {
        return [
          RoleGranted(Chain1, WARRIOR_ROLE, AliceRaw),
          RoleGranted(Chain1, WARRIOR_ROLE, BobRaw),
          RoleRevoked(Chain1, WARRIOR_ROLE, AliceRaw),
          RoleAdminChanged(Chain1, WARRIOR_ROLE, WIZARD_ROLE),
          RoleGranted(Chain1, WIZARD_ROLE, CharlieRaw),
          RoleGranted(Chain2, ROGUE_ROLE, AliceRaw),
          RoleGranted(Chain2, WARRIOR_ROLE, CharlieRaw),
          RoleGranted(Chain1, WARRIOR_ROLE, AliceRaw),
        ]
      },
    })

    const handler = new CrossChainAccessControlHandler(
      'someName',
      {
        type: 'crossChainAccessControl',
        roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' },
        chainAddressNames: {
          [Chain1Long.toString()]: 'Chain1',
          [Chain2Long.toString()]: 'Chain2',
        },
      },
      [
        'function WARRIOR_ROLE() view returns (bytes32)',
        'function ROGUE_ROLE() view returns (bytes32)',
      ],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        Chain1: {
          WARRIOR_ROLE: {
            adminRole: 'WIZARD_ROLE',
            members: [Bob.toString(), Alice.toString()],
          },
          WIZARD_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [Charlie.toString()],
          },
        },
        Chain2: {
          ROGUE_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [Alice.toString()],
          },
          WARRIOR_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [Charlie.toString()],
          },
        },
      },
      ignoreRelative: undefined,
    })
  })
})
