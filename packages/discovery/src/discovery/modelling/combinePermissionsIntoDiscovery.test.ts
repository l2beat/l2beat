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
      discovery.entries,
    )

    expect(discovery.entries.at(1)?.receivedPermissions).toEqual(undefined)
    expect(discovery.permissions).toEqual({
      [PROXY_ADMIN]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })
  })

  it('separates non final permissions', () => {
    const discovery = output([contract(TIMELOCK), contract(COUNCIL)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([{ ...upgrade(COUNCIL, TIMELOCK), isFinal: false }]),
      [...discovery.entries, contract(COUNCIL)],
    )

    expect(discovery.permissions).toEqual({
      [COUNCIL]: {
        directlyReceivedPermissions: [
          { permission: 'upgrade', from: TIMELOCK },
        ],
      },
    })
  })

  it('has no key for an entry that received nothing', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
      discovery.entries,
    )

    expect(Object.keys(discovery.permissions ?? {})).toEqual([PROXY_ADMIN])
  })

  // Reading joins with Object.assign, so a key holding undefined would land on
  // the entry and the diff would report a change that did not happen.
  it('never writes a key holding undefined', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
      discovery.entries,
    )

    const stored = discovery.permissions?.[PROXY_ADMIN]
    expect(Object.keys(stored ?? {})).toEqual(['receivedPermissions'])
  })

  // The consumer's crawl stops at the entrypoint, so an actor inside a shared
  // module holds a permission here without having an entry of its own.
  it('stores a receiver that has no entry in the project', () => {
    const discovery = output([contract(TIMELOCK), reference(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(COUNCIL, TIMELOCK)]),
      // The holder is discovered by the referenced project, not by this one.
      [...discovery.entries, contract(COUNCIL)],
    )

    expect(discovery.permissions).toEqual({
      [COUNCIL]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })
  })

  // A reference points at one deployment inside a shared module, so the rest of
  // what that module discovered is not this project's to carry.
  it('drops a holder the project entrypoints cannot reach', () => {
    const discovery = output([contract(TIMELOCK)])
    const unrelated = address('0x444')

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(COUNCIL, unrelated)]),
      [...discovery.entries, contract(COUNCIL), contract(unrelated)],
    )

    expect(discovery.permissions).toEqual(undefined)
  })

  it('clears a map left over by a previous run', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])
    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
      discovery.entries,
    )

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([]),
      discovery.entries,
    )

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
      discovery.entries,
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

function reference(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Reference', address, targetProject: 'shared-zk-stack' }
}
