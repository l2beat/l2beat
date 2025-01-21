import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import { AccessControlHandler } from './AccessControlHandler'

describe(AccessControlHandler.name, () => {
  const abi = new utils.Interface([
    'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
    'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
    'event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)',
  ])

  function RoleGranted(role: string, account: EthereumAddress): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleGranted'), [
      role,
      account,
      EthereumAddress.ZERO,
    ]) as providers.Log
  }

  function RoleRevoked(role: string, account: EthereumAddress): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleRevoked'), [
      role,
      account,
      EthereumAddress.ZERO,
    ]) as providers.Log
  }

  function RoleAdminChanged(role: string, adminRole: string): providers.Log {
    return abi.encodeEventLog(abi.getEvent('RoleAdminChanged'), [
      role,
      '0x' + '0'.repeat(64),
      adminRole,
    ]) as providers.Log
  }

  it('no logs', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<IProvider>({
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

    const handler = new AccessControlHandler(
      'someName',
      {
        type: 'accessControl',
      },
      [],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        DEFAULT_ADMIN_ROLE: {
          adminRole: 'DEFAULT_ADMIN_ROLE',
          members: [],
        },
      },
      ignoreRelative: undefined,
    })
  })

  it('many logs', async () => {
    const WIZARD_ROLE = utils.solidityKeccak256(['string'], ['WIZARD_ROLE'])
    const WARRIOR_ROLE = utils.solidityKeccak256(['string'], ['WARRIOR_ROLE'])
    const ROGUE_ROLE = utils.solidityKeccak256(['string'], ['ROGUE_ROLE'])
    const GOBLIN_ROLE = utils.solidityKeccak256(['string'], ['GOBLIN_ROLE'])
    const DEFAULT_ADMIN_ROLE = '0x' + '0'.repeat(64)

    const Alice = EthereumAddress.random()
    const Bob = EthereumAddress.random()
    const Charlie = EthereumAddress.random()

    const address = EthereumAddress.random()
    const provider = mockObject<IProvider>({
      async getLogs() {
        return [
          RoleGranted(WARRIOR_ROLE, Alice),
          RoleGranted(WARRIOR_ROLE, Bob),
          RoleRevoked(WARRIOR_ROLE, Alice),
          RoleAdminChanged(WARRIOR_ROLE, WIZARD_ROLE),
          RoleAdminChanged(DEFAULT_ADMIN_ROLE, GOBLIN_ROLE),
          RoleAdminChanged(DEFAULT_ADMIN_ROLE, ROGUE_ROLE),
          RoleGranted(WIZARD_ROLE, Charlie),
          RoleGranted(ROGUE_ROLE, Alice),
          RoleGranted(DEFAULT_ADMIN_ROLE, Bob),
          RoleGranted(DEFAULT_ADMIN_ROLE, Bob),
          RoleRevoked(GOBLIN_ROLE, Charlie),
          RoleGranted(GOBLIN_ROLE, Charlie),
          RoleGranted(WARRIOR_ROLE, Charlie),
          RoleGranted(WARRIOR_ROLE, Alice),
          RoleAdminChanged(ROGUE_ROLE, GOBLIN_ROLE),
        ]
      },
    })

    const handler = new AccessControlHandler(
      'someName',
      { type: 'accessControl', roleNames: { [WIZARD_ROLE]: 'WIZARD_ROLE' } },
      [
        'function WARRIOR_ROLE() view returns (bytes32)',
        'function ROGUE_ROLE() view returns (bytes32)',
      ],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        DEFAULT_ADMIN_ROLE: {
          adminRole: 'ROGUE_ROLE',
          members: [Bob.toString()],
        },
        WARRIOR_ROLE: {
          adminRole: 'WIZARD_ROLE',
          members: [Bob.toString(), Charlie.toString(), Alice.toString()],
        },
        WIZARD_ROLE: {
          adminRole: 'DEFAULT_ADMIN_ROLE',
          members: [Charlie.toString()],
        },
        ROGUE_ROLE: {
          adminRole: GOBLIN_ROLE,
          members: [Alice.toString()],
        },
        [GOBLIN_ROLE]: {
          adminRole: 'DEFAULT_ADMIN_ROLE',
          members: [Charlie.toString()],
        },
      },
      ignoreRelative: undefined,
    })
  })

  it('passes relative ignore', async () => {
    const address = EthereumAddress.random()
    const provider = mockObject<IProvider>({
      async getLogs() {
        return []
      },
    })

    const handler = new AccessControlHandler(
      'someName',
      {
        type: 'accessControl',
        ignoreRelative: true,
      },
      [],
    )
    const value = await handler.execute(provider, address)
    expect(value).toEqual({
      field: 'someName',
      value: {
        DEFAULT_ADMIN_ROLE: {
          adminRole: 'DEFAULT_ADMIN_ROLE',
          members: [],
        },
      },
      ignoreRelative: true,
    })
  })
})
