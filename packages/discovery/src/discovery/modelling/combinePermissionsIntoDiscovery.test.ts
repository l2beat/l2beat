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
const SECURITY_COUNCIL = address('0x333')
const SHARED_CONTRACT = address('0x444')

const HASH = Hash256.random()

describe(combinePermissionsIntoDiscovery.name, () => {
  it('attaches a permission received by an entry of the project', () => {
    const discovery = output([contract(TIMELOCK), contract(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    expect(discovery.entries.at(1)?.receivedPermissions).toEqual([
      { permission: 'upgrade', from: TIMELOCK },
    ])
    expect(discovery.referencedPermissions).toEqual(undefined)
  })

  it('routes a receiver that lives in a referenced project to the map', () => {
    const discovery = output([contract(TIMELOCK), reference(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(SECURITY_COUNCIL, TIMELOCK)]),
    )

    expect(discovery.referencedPermissions).toEqual({
      [SECURITY_COUNCIL]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })
  })

  // The stub carries no data of its own and the read side resolves the
  // address against the project that owns it.
  it('never writes onto a Reference stub', () => {
    const discovery = output([contract(TIMELOCK), reference(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(PROXY_ADMIN, TIMELOCK)]),
    )

    expect(discovery.entries.at(1)?.receivedPermissions).toEqual(undefined)
    expect(discovery.referencedPermissions).toEqual({
      [PROXY_ADMIN]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })
  })

  // Otherwise every consumer would carry a copy of the shared module's
  // internal permission graph.
  it('drops a permission that neither starts nor ends in the project', () => {
    const discovery = output([contract(TIMELOCK), reference(PROXY_ADMIN)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(SECURITY_COUNCIL, SHARED_CONTRACT)]),
    )

    expect(discovery.referencedPermissions).toEqual(undefined)
  })

  it('separates non final permissions', () => {
    const discovery = output([contract(TIMELOCK)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([{ ...upgrade(SECURITY_COUNCIL, TIMELOCK), isFinal: false }]),
    )

    expect(discovery.referencedPermissions).toEqual({
      [SECURITY_COUNCIL]: {
        directlyReceivedPermissions: [
          { permission: 'upgrade', from: TIMELOCK },
        ],
      },
    })
  })

  it('clears a map left over by a previous run', () => {
    const discovery = output([contract(TIMELOCK)])
    combinePermissionsIntoDiscovery(
      discovery,
      permissions([upgrade(SECURITY_COUNCIL, TIMELOCK)]),
    )

    combinePermissionsIntoDiscovery(discovery, permissions([]))

    expect(discovery.referencedPermissions).toEqual(undefined)
  })

  it('sorts the map by address', () => {
    const discovery = output([contract(TIMELOCK)])

    combinePermissionsIntoDiscovery(
      discovery,
      permissions([
        upgrade(SHARED_CONTRACT, TIMELOCK),
        upgrade(SECURITY_COUNCIL, TIMELOCK),
      ]),
    )

    expect(Object.keys(discovery.referencedPermissions ?? {})).toEqual([
      SECURITY_COUNCIL,
      SHARED_CONTRACT,
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
