import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { mergeReferencedPermissions } from './mergeReferencedPermissions'

const TIMELOCK = address('0x111')
const SECURITY_COUNCIL = address('0x222')
const SHARED_CONTRACT = address('0x333')

const OVER_CONSUMER = { permission: 'upgrade' as const, from: TIMELOCK }
const OVER_MODULE = { permission: 'upgrade' as const, from: SHARED_CONTRACT }

describe(mergeReferencedPermissions.name, () => {
  it('joins a permission onto the entry of the project that owns it', () => {
    const consumer = output('abstract', [contract(TIMELOCK)], {
      [SECURITY_COUNCIL]: { receivedPermissions: [OVER_CONSUMER] },
    })
    const sharedModule = output('shared-zk-stack', [
      { ...contract(SECURITY_COUNCIL), receivedPermissions: [OVER_MODULE] },
    ])

    mergeReferencedPermissions([consumer, sharedModule])

    expect(sharedModule.entries.at(0)?.receivedPermissions).toEqual([
      OVER_MODULE,
      OVER_CONSUMER,
    ])
  })

  it('is idempotent', () => {
    const consumer = output('abstract', [contract(TIMELOCK)], {
      [SECURITY_COUNCIL]: { receivedPermissions: [OVER_CONSUMER] },
    })
    const sharedModule = output('shared-zk-stack', [contract(SECURITY_COUNCIL)])

    mergeReferencedPermissions([consumer, sharedModule])
    mergeReferencedPermissions([consumer, sharedModule])

    expect(sharedModule.entries.at(0)?.receivedPermissions).toEqual([
      OVER_CONSUMER,
    ])
  })

  it('carries the EOA upgrade flag over', () => {
    const consumer = output('abstract', [contract(TIMELOCK)], {
      [SECURITY_COUNCIL]: { eoaWithUpgradePermissions: true },
    })
    const sharedModule = output('shared-zk-stack', [eoa(SECURITY_COUNCIL)])

    mergeReferencedPermissions([consumer, sharedModule])

    expect(sharedModule.entries.at(0)?.eoaWithUpgradePermissions).toEqual(true)
  })

  // A nested cluster: the consumer of a shared module carries its own map,
  // and it must reach past the module it references directly.
  it('merges maps of every discovery in the cluster', () => {
    const consumer = output('sophon', [contract(TIMELOCK)])
    const middle = output('vector', [contract(SHARED_CONTRACT)], {
      [SECURITY_COUNCIL]: { receivedPermissions: [OVER_MODULE] },
    })
    const leaf = output('shared-sp1', [contract(SECURITY_COUNCIL)])

    mergeReferencedPermissions([consumer, middle, leaf])

    expect(leaf.entries.at(0)?.receivedPermissions).toEqual([OVER_MODULE])
  })

  it('ignores an address that no discovery of the cluster owns', () => {
    const consumer = output('abstract', [contract(TIMELOCK)], {
      [SECURITY_COUNCIL]: { receivedPermissions: [OVER_CONSUMER] },
    })

    expect(() => mergeReferencedPermissions([consumer])).not.toThrow()
  })
})

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}

function eoa(address: ChainSpecificAddress): EntryParameters {
  return { type: 'EOA', address }
}

function output(
  name: string,
  entries: EntryParameters[],
  referencedPermissions?: DiscoveryOutput['referencedPermissions'],
): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.random(),
    usedTemplates: {},
    usedBlockNumbers: {},
    referencedPermissions,
  }
}
