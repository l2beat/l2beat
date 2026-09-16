import {
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
    discoveries.set(
      'abstract',
      output('abstract', [reference(COUNCIL, 'shared')]),
    )

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(discoveries.getSortedProjects()).toEqual(['abstract', 'shared'])
  })

  // The point of the helper: the project was just discovered at a block that is
  // not on disk, so the fresh output has to survive.
  it('keeps the freshly discovered project authoritative', () => {
    const fresh = output('abstract', [
      contract(TIMELOCK),
      reference(COUNCIL, 'shared'),
    ])
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', fresh)

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(discoveries.get('abstract').discoveryOutput).toEqual(fresh)
  })

  it('collects the entries of the whole cluster', () => {
    const discoveries = new DiscoveryRegistry()
    discoveries.set(
      'abstract',
      output('abstract', [contract(TIMELOCK), reference(COUNCIL, 'shared')]),
    )

    addReferencedDiscoveries(discoveries, 'abstract', reader())

    expect(clusterEntries(discoveries).map((e) => e.address)).toEqual([
      TIMELOCK,
      COUNCIL,
      COUNCIL,
    ])
  })

  // Modelling the project alone would look like every cross-project permission
  // had been removed, and that result would be saved and diffed.
  it('throws rather than modelling the project on its own', () => {
    const discoveries = new DiscoveryRegistry()
    const fresh = output('abstract', [reference(COUNCIL, 'shared')])
    discoveries.set('abstract', fresh)
    const broken = mockObject<ConfigReader>({
      readDiscovery: (name) => {
        if (name === 'shared') {
          return output('shared', [reference(TIMELOCK, 'missing')])
        }
        throw new Error('missing project')
      },
    })

    expect(() =>
      addReferencedDiscoveries(discoveries, 'abstract', broken),
    ).toThrow()
    expect(discoveries.getSortedProjects()).toEqual(['abstract'])
    expect(discoveries.get('abstract').discoveryOutput).toEqual(fresh)
  })

  it('does not read the base project or load references removed from it', () => {
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', output('abstract', [contract(TIMELOCK)]))
    const readDiscovery = mockFn<ConfigReader['readDiscovery']>()

    addReferencedDiscoveries(
      discoveries,
      'abstract',
      mockObject<ConfigReader>({ readDiscovery }),
    )

    expect(readDiscovery).not.toHaveBeenCalled()
    expect(discoveries.getSortedProjects()).toEqual(['abstract'])
  })

  it('loads transitive references once and stops cycles at the fresh project', () => {
    const fresh = output('abstract', [
      reference(TIMELOCK, 'shared'),
      reference(COUNCIL, 'nested'),
    ])
    const discoveries = new DiscoveryRegistry()
    discoveries.set('abstract', fresh)
    const readDiscovery = mockFn<ConfigReader['readDiscovery']>()
      .given('shared')
      .returnsOnce(output('shared', [reference(COUNCIL, 'nested')]))
      .given('nested')
      .returnsOnce(output('nested', [reference(TIMELOCK, 'abstract')]))

    addReferencedDiscoveries(
      discoveries,
      'abstract',
      mockObject<ConfigReader>({ readDiscovery }),
    )

    expect(discoveries.getSortedProjects()).toEqual([
      'abstract',
      'nested',
      'shared',
    ])
    expect(readDiscovery).toHaveBeenCalledTimes(2)
    expect(discoveries.get('abstract').discoveryOutput).toEqual(fresh)
  })
})

function reader(): ConfigReader {
  return mockObject<ConfigReader>({
    readDiscovery: mockFn<ConfigReader['readDiscovery']>()
      .given('shared')
      .returnsOnce(output('shared', [contract(COUNCIL)])),
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
    modelledAgainst: {},
    usedBlockNumbers: {},
  }
}

function contract(address: ChainSpecificAddress): EntryParameters {
  return { type: 'Contract', address }
}

function reference(
  address: ChainSpecificAddress,
  targetProject: string,
): EntryParameters {
  return { type: 'Reference', address, targetProject }
}
