import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getProjects } from './getProjects'

describe(getProjects.name, () => {
  it('pairs each id with its config name', () => {
    const configReader = mockConfigReader(['lyra', 'zksync2'])
    const configNames = new Map([
      ['lyra', 'Derive'],
      ['zksync2', 'ZKsync Era'],
    ])

    const response = getProjects(configReader, configNames)

    expect(namesOf(response)).toEqual([
      { name: 'lyra', displayName: 'Derive' },
      { name: 'zksync2', displayName: 'ZKsync Era' },
    ])
  })

  it('leaves the id alone for projects without a config', () => {
    const configReader = mockConfigReader(['shared-sp1', 'lyra'])
    const configNames = new Map([['lyra', 'Derive']])

    const response = getProjects(configReader, configNames)

    expect(namesOf(response)).toEqual([
      { name: 'lyra', displayName: 'Derive' },
      { name: 'shared-sp1', displayName: undefined },
    ])
  })

  it('drops a config name that only differs from the id in case or punctuation', () => {
    const configReader = mockConfigReader([
      'aevo',
      'rocketpool',
      'tornado-cash',
    ])
    const configNames = new Map([
      ['aevo', 'Aevo'],
      ['rocketpool', 'Rocket Pool'],
      ['tornado-cash', 'Tornado Cash'],
    ])

    const response = getProjects(configReader, configNames)

    expect(namesOf(response)).toEqual([
      { name: 'aevo', displayName: undefined },
      { name: 'rocketpool', displayName: undefined },
      { name: 'tornado-cash', displayName: undefined },
    ])
  })
})

function namesOf(response: ReturnType<typeof getProjects>) {
  return response.map((x) => ({ name: x.name, displayName: x.displayName }))
}

function mockConfigReader(projects: string[]): ConfigReader {
  return mockObject<ConfigReader>({
    readAllDiscoveredProjects: () => projects,
    readDiscovery: (name: string) => discovery(name),
  })
}

function discovery(name: string): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries: [],
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    modelledAgainst: {},
    usedBlockNumbers: {},
  }
}
