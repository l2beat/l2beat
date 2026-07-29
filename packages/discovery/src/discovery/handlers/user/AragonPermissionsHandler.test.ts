import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'

import type { IProvider } from '../../provider/IProvider'
import {
  AragonPermissionsHandler,
  fetchAragonPermissions,
} from './AragonPermissionsHandler'

describe(AragonPermissionsHandler.name, () => {
  const aclAbi = new utils.Interface([
    'event SetPermission(address indexed entity, address indexed app, bytes32 indexed role, bool allowed)',
    'event ChangePermissionManager(address indexed app, bytes32 indexed role, address indexed manager)',
  ])

  const WIZARD_ROLE = utils.solidityKeccak256(['string'], ['WIZARD_ROLE'])

  function SetPermission(
    entity: EthereumAddress,
    app: EthereumAddress,
    role: string,
    allowed: boolean,
  ): providers.Log {
    return aclAbi.encodeEventLog(aclAbi.getEvent('SetPermission'), [
      entity,
      app,
      role,
      allowed,
    ]) as providers.Log
  }

  function ChangePermissionManager(
    app: EthereumAddress,
    role: string,
    manager: EthereumAddress,
  ): providers.Log {
    return aclAbi.encodeEventLog(aclAbi.getEvent('ChangePermissionManager'), [
      app,
      role,
      manager,
    ]) as providers.Log
  }

  it('reconstructs permissions for one app from the shared ACL', async () => {
    const app = ChainSpecificAddress.random()
    const otherApp = ChainSpecificAddress.random()
    const acl = ChainSpecificAddress.random()
    const alice = ChainSpecificAddress.random()
    const bob = ChainSpecificAddress.random()
    const manager = ChainSpecificAddress.random()

    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async getLogs(providedAddress, topics) {
        expect(providedAddress).toEqual(acl)
        expect(topics).toEqual([
          [
            aclAbi.getEventTopic('SetPermission'),
            aclAbi.getEventTopic('ChangePermissionManager'),
          ],
        ])
        return [
          SetPermission(
            ChainSpecificAddress.address(alice),
            ChainSpecificAddress.address(app),
            WIZARD_ROLE,
            true,
          ),
          SetPermission(
            ChainSpecificAddress.address(bob),
            ChainSpecificAddress.address(otherApp),
            WIZARD_ROLE,
            true,
          ),
          SetPermission(
            ChainSpecificAddress.address(alice),
            ChainSpecificAddress.address(app),
            WIZARD_ROLE,
            false,
          ),
          SetPermission(
            ChainSpecificAddress.address(bob),
            ChainSpecificAddress.address(app),
            WIZARD_ROLE,
            true,
          ),
          ChangePermissionManager(
            ChainSpecificAddress.address(app),
            WIZARD_ROLE,
            ChainSpecificAddress.address(manager),
          ),
        ]
      },
    })

    const result = await fetchAragonPermissions(provider, acl, app)

    expect(result).toEqual({
      [WIZARD_ROLE.toLowerCase()]: {
        members: [bob.toString()],
        managers: [manager.toString()],
      },
    })
  })

  it('resolves the ACL through the app kernel and names ABI roles', async () => {
    const app = ChainSpecificAddress.random()
    const kernel = ChainSpecificAddress.random()
    const acl = ChainSpecificAddress.random()
    const member = ChainSpecificAddress.random()

    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async callMethod<T>(address: ChainSpecificAddress) {
        if (address === app) {
          return ChainSpecificAddress.address(kernel) as T
        }
        if (address === kernel) {
          return ChainSpecificAddress.address(acl) as T
        }
        return undefined
      },
      async getLogs() {
        return [
          SetPermission(
            ChainSpecificAddress.address(member),
            ChainSpecificAddress.address(app),
            WIZARD_ROLE,
            true,
          ),
        ]
      },
    })

    const handler = new AragonPermissionsHandler(
      'aragonPermissions',
      { type: 'aragonPermissions' },
      ['function WIZARD_ROLE() view returns (bytes32)'],
    )

    const result = await handler.execute(provider, app)

    expect(result).toEqual({
      field: 'aragonPermissions',
      value: {
        WIZARD_ROLE: {
          members: [member.toString()],
          managers: [],
        },
      },
      ignoreRelative: undefined,
    })
  })

  it('includes ABI roles which have never been granted', async () => {
    const app = ChainSpecificAddress.random()
    const kernel = ChainSpecificAddress.random()
    const acl = ChainSpecificAddress.random()

    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      async callMethod<T>(address: ChainSpecificAddress) {
        if (address === app) {
          return ChainSpecificAddress.address(kernel) as T
        }
        if (address === kernel) {
          return ChainSpecificAddress.address(acl) as T
        }
        return undefined
      },
      async getLogs() {
        return []
      },
    })

    const handler = new AragonPermissionsHandler(
      'aragonPermissions',
      { type: 'aragonPermissions' },
      ['function WIZARD_ROLE() view returns (bytes32)'],
    )

    const result = await handler.execute(provider, app)

    expect(result).toEqual({
      field: 'aragonPermissions',
      value: {
        WIZARD_ROLE: {
          members: [],
          managers: [],
        },
      },
      ignoreRelative: undefined,
    })
  })
})
