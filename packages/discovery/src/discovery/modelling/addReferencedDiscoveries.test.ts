import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import {
  addReferencedDiscoveries,
  clusterEntries,
  DiscoveryRegistry,
} from './modelPermissions'

const TIMELOCK = address('0x111')
const COUNCIL = address('0x222')

describe(addReferencedDiscoveries.name, () => {
  it('adds the committed discovery of every referenced project', () => {
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', output('abstract', [contract(TIMELOCK)]))

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(discoveries.getSortedProjects()).toEqual(['abstract', 'shared'])
  })

  // The point of the helper: the project was just discovered at a block that is
  // not on disk, so the fresh output has to survive.
  it('keeps the freshly discovered project authoritative', () => {
    const fresh = output('abstract', [contract(TIMELOCK), contract(COUNCIL)])
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', fresh)

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(discoveries.get('abstract').discoveryOutput).toEqual(fresh)
  })

  it('collects the entries of the whole cluster', () => {
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', output('abstract', [contract(TIMELOCK)]))

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(clusterEntries(discoveries).map((e) => e.address)).toEqual([
      TIMELOCK,
      COUNCIL,
    ])
  })

  // Modelling the project alone would look like every cross-project permission
  // had been removed, and that result would be saved and diffed.
  it('throws rather than modelling the project on its own', () => {
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', output('abstract', [contract(TIMELOCK)]))
    const broken = mockObject<ConfigReader>({
      readDiscoveryWithReferences: () => {
        throw new Error('missing project')
      },
    })

    expect(() =>
      addReferencedDiscoveries(discoveries, 'abstract', broken),
    ).toThrow()
  })
})

function reader(): ConfigReader {
  return mockObject<ConfigReader>({
    readDiscoveryWithReferences: () => [
      output('abstract', [contract(TIMELOCK)]),
      output('shared', [contract(COUNCIL)]),
    ],
  })
}

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function output(name: string, entries: EntryParameters[]): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.random(),
    usedTemplates: {},
    usedBlockNumbers: {},
  }
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}
