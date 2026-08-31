import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  DiscoveryOutput,
  EntryParameters,
  PermissionsOutput,
} from '../output/types'
import { combinePermissionsIntoDiscovery } from './combinePermissionsIntoDiscovery'

const TIMELOCK = address('0x111')
const PROXY_ADMIN = address('0x222')
const COUNCIL = address('0x333')

const HASH = Hash256.random()

describe(combinePermissionsIntoDiscovery.name, () => {
  it('stores a permission in the map, never on the entry', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    expect(discovery.entries.at(1)?.receivedPermissions).toEqual(undefined)
    expect(discovery.permissions).toEqual({
      [PROXY_ADMIN]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
        directlyReceivedPermissions: undefined,
        eoaWithUpgradePermissions: undefined,
      },
    })
  })

  it('separates non final permissions', () => {
    const discovery = output([contract(TIMELOCK), contract(COUNCIL)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([{ ...upgrade(COUNCIL, TIMELOCK), isFinal: false }]),
    )

    expect(discovery.permissions).toEqual({
      [COUNCIL]: {
        receivedPermissions: undefined,
        directlyReceivedPermissions: [
          { permission: 'upgrade', from: TIMELOCK },
        ],
        eoaWithUpgradePermissions: undefined,
      },
    })
  })

  it('has no key for an entry that received nothing', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    expect(Object.keys(discovery.permissions ?? {})).toEqual([PROXY_ADMIN])
  })

  it('clears a map left over by a previous run', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])
    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    combinePermissionsIntoDiscovery(discovery, permissions([]))

    expect(discovery.permissions).toEqual(undefined)
  })

  it('sorts the map by address', () => {
    const discovery = output([
      contract(TIMELOCK),
      contract(PROXY_ADMIN),
      contract(COUNCIL),
    ])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(COUNCIL, TIMELOCK), upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    expect(Object.keys(discovery.permissions ?? {})).toEqual([
      PROXY_ADMIN,
      COUNCIL,
    ])
  })
})

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function upgrade(
  receiver: ChainSpecificAddress,
  from: ChainSpecificAddress,
): PermissionsOutput['permissions'][number] {
  return { receiver, permission: 'upgrade', from, isFinal: true }
}

function permissions(
  permissions: PermissionsOutput['permissions'],
): PermissionsOutput {
  return { permissionsConfigHash: HASH, permissions }
}

function output(entries: EntryParameters[]): DiscoveryOutput {
  return {
    name: 'abstract',
    timestamp: 0,
    entries,
    abis: {},
    configHash: HASH,
    usedTemplates: {},
    usedBlockNumbers: {},
  }
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}
