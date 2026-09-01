import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { attachPermissions } from './attachPermissions'
import type { DiscoveryOutput, EntryParameters } from './types'

const TIMELOCK = address('0x111')
const COUNCIL = address('0x222')

const HASH = Hash256.random()

describe(attachPermissions.name, () => {
  it('joins the map onto the entry that holds the address', () => {
    const discovery = output('abstract', [contract(COUNCIL)], {
      [COUNCIL]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })

    attachPermissions([discovery])

    expect(discovery.entries.at(0)?.receivedPermissions).toEqual([
      { permission: 'upgrade', from: TIMELOCK },
    ])
  })

  // Each project of a cluster owns the permissions of its own addresses, so a
  // referenced module's entries are filled from the module's own map.
  it('applies each map to the entries of its own project', () => {
    const consumer = output('abstract', [contract(TIMELOCK)])
    const module = output('shared', [contract(COUNCIL)], {
      [COUNCIL]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })

    attachPermissions([consumer, module])

    expect(module.entries.at(0)?.receivedPermissions).toEqual([
      { permission: 'upgrade', from: TIMELOCK },
    ])
  })

  it('does not reach across projects', () => {
    const consumer = output('abstract', [contract(TIMELOCK)], {
      [COUNCIL]: {
        receivedPermissions: [{ permission: 'upgrade', from: TIMELOCK }],
      },
    })
    const module = output('shared', [contract(COUNCIL)])

    attachPermissions([consumer, module])

    expect(module.entries.at(0)?.receivedPermissions).toEqual(undefined)
  })

  it('leaves an address the map does not mention alone', () => {
    const discovery = output('abstract', [contract(TIMELOCK)], {
      [COUNCIL]: { eoaWithUpgradePermissions: true },
    })

    attachPermissions([discovery])

    expect(discovery.entries.at(0)?.eoaWithUpgradePermissions).toEqual(
      undefined,
    )
  })
})

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function output(
  name: string,
  entries: EntryParameters[],
  permissions?: DiscoveryOutput['permissions'],
): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: HASH,
    usedTemplates: {},
    usedBlockNumbers: {},
    permissions,
  }
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}
