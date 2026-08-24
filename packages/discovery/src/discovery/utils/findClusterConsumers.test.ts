import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { findClusterConsumers } from './findClusterConsumers'

describe(findClusterConsumers.name, () => {
  it('finds the projects referencing the given one', () => {
    const configReader = mockConfigReader([
      discovery('shared-zk-stack', []),
      discovery('abstract', [reference('shared-zk-stack')]),
      discovery('sophon', [reference('shared-zk-stack')]),
    ])

    expect(findClusterConsumers(configReader, 'shared-zk-stack')).toEqual([
      'abstract',
      'sophon',
    ])
  })

  // `molten` references `blobstream`, which references `shared-sp1`, so a
  // change in `shared-sp1` reaches `molten` two hops away.
  it('follows references transitively', () => {
    const configReader = mockConfigReader([
      discovery('shared-sp1', []),
      discovery('blobstream', [reference('shared-sp1')]),
      discovery('molten', [reference('blobstream')]),
    ])

    expect(findClusterConsumers(configReader, 'shared-sp1')).toEqual([
      'blobstream',
      'molten',
    ])
  })

  it('never reports the project itself, even in a cycle', () => {
    const configReader = mockConfigReader([
      discovery('a', [reference('b')]),
      discovery('b', [reference('a')]),
    ])

    expect(findClusterConsumers(configReader, 'a')).toEqual(['b'])
  })

  it('is empty when nothing references the project', () => {
    const configReader = mockConfigReader([discovery('abstract', [])])

    expect(findClusterConsumers(configReader, 'abstract')).toEqual([])
  })
})

function mockConfigReader(discoveries: DiscoveryOutput[]): ConfigReader {
  return mockObject<ConfigReader>({
    readAllDiscoveredProjects: () => discoveries.map((d) => d.name),
    readDiscovery: (name: string) => {
      const discovery = discoveries.find((d) => d.name === name)
      if (discovery === undefined) {
        throw new Error(`No discovery for ${name}`)
      }
      return discovery
    },
  })
}

function reference(targetProject: string): EntryParameters {
  return {
    type: 'Reference',
    address: ChainSpecificAddress.random(),
    targetProject,
  }
}

function discovery(name: string, entries: EntryParameters[]): DiscoveryOutput {
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
