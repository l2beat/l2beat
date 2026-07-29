import type {
  ConfigReader,
  ConfigRegistry,
  DiscoveryOutput,
  EntryParameters,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { getProject } from './getProject'

const PROJECT = 'abstract'
const SHARED = 'shared-zk-stack'

const PROJECT_CONTRACT = ChainSpecificAddress.random()
const SHARED_CONTRACT = ChainSpecificAddress.random()
const SHARED_EOA = ChainSpecificAddress.random()

describe(getProject.name, () => {
  it('scopes an EOA discovered by both to the project, not the shared module', () => {
    const configReader = mockConfigReader([
      discovery(PROJECT, [
        contract('ProjectContract', PROJECT_CONTRACT),
        reference(SHARED_CONTRACT, SHARED),
        eoa('Operator', SHARED_EOA),
      ]),
      discovery(SHARED, [
        contract('SharedContract', SHARED_CONTRACT),
        eoa('Operator', SHARED_EOA),
      ]),
    ])

    const response = getProject(configReader, mockTemplateService(), PROJECT)

    expect(addressesOf(response.entries[0])).toEqual([
      PROJECT_CONTRACT,
      SHARED_EOA,
    ])
    expect(addressesOf(response.entries[1])).toEqual([SHARED_CONTRACT])
  })

  it('scopes an EOA shared by two modules to the first of them', () => {
    const other = 'shared-sp1'
    const configReader = mockConfigReader([
      discovery(PROJECT, [contract('ProjectContract', PROJECT_CONTRACT)]),
      discovery(SHARED, [eoa('Operator', SHARED_EOA)]),
      discovery(other, [eoa('Operator', SHARED_EOA)]),
    ])

    const response = getProject(configReader, mockTemplateService(), PROJECT)

    expect(addressesOf(response.entries[1])).toEqual([SHARED_EOA])
    expect(addressesOf(response.entries[2])).toEqual([])
  })

  it('never returns the same address twice', () => {
    const configReader = mockConfigReader([
      discovery(PROJECT, [
        contract('Shared', SHARED_CONTRACT),
        eoa('Operator', SHARED_EOA),
      ]),
      discovery(SHARED, [
        contract('Shared', SHARED_CONTRACT),
        eoa('Operator', SHARED_EOA),
      ]),
    ])

    const response = getProject(configReader, mockTemplateService(), PROJECT)

    const addresses = response.entries.flatMap(addressesOf)
    expect(addresses.length).toEqual(new Set(addresses).size)
  })
})

function addressesOf(chain: {
  initialContracts: { address: ChainSpecificAddress }[]
  discoveredContracts: { address: ChainSpecificAddress }[]
  eoas: { address: ChainSpecificAddress }[]
}): ChainSpecificAddress[] {
  return [
    ...chain.initialContracts,
    ...chain.discoveredContracts,
    ...chain.eoas,
  ].map((x) => x.address)
}

function mockConfigReader(discoveries: DiscoveryOutput[]): ConfigReader {
  const byName = new Map(discoveries.map((x) => [x.name, x]))
  return mockObject<ConfigReader>({
    readDiscoveryWithReferences: () => discoveries,
    readDiscovery: (name: string) => {
      const found = byName.get(name)
      if (found === undefined) throw new Error(`Unknown project ${name}`)
      return found
    },
    readConfig: (name: string) =>
      mockObject<ConfigRegistry>({
        name,
        structure: { name, initialAddresses: [] },
        color: { name },
      } as unknown as ConfigRegistry),
  })
}

// No entry under test declares a template, so only the color lookup is hit.
function mockTemplateService(): TemplateService {
  return mockObject<TemplateService>({
    loadContractTemplateColor: () => ({ fields: {}, manualSourcePaths: {} }),
  })
}

function discovery(
  name: string,
  entries: EntryParameters[],
  sharedModules?: string[],
): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    usedBlockNumbers: {},
    sharedModules,
  }
}

function contract(
  name: string,
  address: ChainSpecificAddress,
): EntryParameters {
  return { type: 'Contract', name, address, values: {} }
}

function eoa(name: string, address: ChainSpecificAddress): EntryParameters {
  return { type: 'EOA', name, address }
}

function reference(
  address: ChainSpecificAddress,
  targetProject: string,
): EntryParameters {
  return { type: 'Reference', address, targetProject }
}
