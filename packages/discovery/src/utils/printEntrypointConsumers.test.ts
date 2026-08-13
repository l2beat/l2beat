import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../discovery/config/ConfigReader'
import type { StructureConfig } from '../discovery/config/StructureConfig'
import type {
  DiscoveryOutput,
  EntryParameters,
} from '../discovery/output/types'
import {
  findEntrypointConsumers,
  ownsEntrypoints,
} from './printEntrypointConsumers'

const PROVIDER = 'shared-zk-stack'
const OTHER_PROVIDER = 'shared-sp1'

describe(ownsEntrypoints.name, () => {
  it('is true when the project owns one of the global entrypoints', () => {
    expect(
      ownsEntrypoints(
        structure(PROVIDER, { [ChainSpecificAddress.random()]: PROVIDER }),
      ),
    ).toEqual(true)
  })

  it('is false when every entrypoint belongs to another project', () => {
    expect(
      ownsEntrypoints(
        structure('abstract', {
          [ChainSpecificAddress.random()]: PROVIDER,
          [ChainSpecificAddress.random()]: OTHER_PROVIDER,
        }),
      ),
    ).toEqual(false)
  })

  it('is false when there are no entrypoints at all', () => {
    expect(ownsEntrypoints(structure('abstract', {}))).toEqual(false)
  })
})

describe(findEntrypointConsumers.name, () => {
  it('counts referencing addresses per project, most first', () => {
    const configReader = mockConfigReader([
      discovery(PROVIDER, [contract(), contract()]),
      discovery('abstract', [reference(PROVIDER)]),
      discovery('zksync2', [reference(PROVIDER), reference(PROVIDER)]),
    ])

    expect(findEntrypointConsumers(configReader, PROVIDER)).toEqual([
      { project: 'zksync2', addressCount: 2 },
      { project: 'abstract', addressCount: 1 },
    ])
  })

  it('ignores references aimed at a different project', () => {
    const configReader = mockConfigReader([
      discovery(PROVIDER, [contract()]),
      discovery('abstract', [reference(OTHER_PROVIDER)]),
    ])

    expect(findEntrypointConsumers(configReader, PROVIDER)).toEqual([])
  })

  // A provider discovers its own entrypoints as real contracts, so it must
  // never count as its own consumer.
  it('never reports the project itself', () => {
    const configReader = mockConfigReader([
      discovery(PROVIDER, [reference(PROVIDER)]),
    ])

    expect(findEntrypointConsumers(configReader, PROVIDER)).toEqual([])
  })
})

function structure(
  name: string,
  owners: Record<string, string>,
): Pick<StructureConfig, 'name' | 'entrypoints'> {
  return {
    name,
    entrypoints: Object.fromEntries(
      Object.entries(owners).map(([address, project]) => [
        address,
        { type: 'Contract' as const, project },
      ]),
    ),
  }
}

function mockConfigReader(discoveries: DiscoveryOutput[]): ConfigReader {
  const byName = new Map(discoveries.map((x) => [x.name, x]))
  return mockObject<ConfigReader>({
    readAllDiscoveredProjects: () => discoveries.map((x) => x.name),
    readDiscovery: (name: string) => {
      const found = byName.get(name)
      if (found === undefined) throw new Error(`Unknown project ${name}`)
      return found
    },
  })
}

function discovery(name: string, entries: EntryParameters[]): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    usedBlockNumbers: {},
  }
}

function contract(): EntryParameters {
  return {
    type: 'Contract',
    address: ChainSpecificAddress.random(),
    values: {},
  }
}

function reference(targetProject: string): EntryParameters {
  return {
    type: 'Reference',
    address: ChainSpecificAddress.random(),
    targetProject,
  }
}
