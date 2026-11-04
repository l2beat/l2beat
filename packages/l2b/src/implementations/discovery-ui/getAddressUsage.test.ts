import {
  ConfigReader,
  type DiscoveryOutput,
  type EntryParameters,
} from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import {
  buildAddressUsage,
  readUsageSources,
  type UsageSource,
} from './getAddressUsage'

const MODULE = 'shared-zk-stack'
const BRIDGE_HUB = ChainSpecificAddress.random()
const SAFE = ChainSpecificAddress.random()
const DIAMOND = ChainSpecificAddress.random()

describe(buildAddressUsage.name, () => {
  it('keeps only addresses that two or more projects discover', () => {
    const usage = buildAddressUsage([
      source('abstract', [
        contract('Safe', SAFE),
        contract('Diamond', DIAMOND),
      ]),
      source('sophon', [contract('GnosisSafe', SAFE)]),
    ])

    expect(usage.sharedAddresses).toEqual({
      [SAFE]: [
        { project: 'abstract', name: 'Safe', viaModule: undefined },
        { project: 'sophon', name: 'GnosisSafe', viaModule: undefined },
      ],
    })
  })

  it('counts a module reference as a use and its referrer as a consumer', () => {
    const usage = buildAddressUsage([
      source('sophon', [reference(BRIDGE_HUB, MODULE)]),
      source('abstract', [reference(BRIDGE_HUB, MODULE)]),
      source(MODULE, [contract('BridgeHub', BRIDGE_HUB)]),
    ])

    expect(usage.sharedAddresses[BRIDGE_HUB]).toEqual([
      { project: 'sophon', name: undefined, viaModule: MODULE },
      { project: 'abstract', name: undefined, viaModule: MODULE },
      { project: MODULE, name: 'BridgeHub', viaModule: undefined },
    ])
    expect(usage.moduleConsumers).toEqual({ [MODULE]: ['abstract', 'sophon'] })
  })

  it('collects the entrypoints every module declares', () => {
    const usage = buildAddressUsage([
      source(MODULE, [], {
        [BRIDGE_HUB]: { name: 'BridgeHub', project: MODULE },
        [SAFE]: { project: MODULE },
      }),
    ])

    expect(usage.entrypoints).toEqual({
      [BRIDGE_HUB]: { name: 'BridgeHub', project: MODULE },
      [SAFE]: { name: undefined, project: MODULE },
    })
  })

  it('lists a module that declares entrypoints before anyone uses it', () => {
    const usage = buildAddressUsage([
      source(MODULE, [contract('BridgeHub', BRIDGE_HUB)], {
        [BRIDGE_HUB]: { project: MODULE },
      }),
    ])

    expect(usage.moduleConsumers).toEqual({ [MODULE]: [] })
  })

  it('rejects an entrypoint two modules declare', () => {
    const declared = { [BRIDGE_HUB]: { project: MODULE } }

    expect(() =>
      buildAddressUsage([
        source(MODULE, [], declared),
        source('shared-sp1', [], declared),
      ]),
    ).toThrow('Entrypoint declared twice')
  })
})

describe(readUsageSources.name, () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'address-usage-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('reads every discovered project and the entrypoints it declares', () => {
    writeProject(root, 'abstract', [reference(BRIDGE_HUB, MODULE)])
    writeProject(root, MODULE, [contract('BridgeHub', BRIDGE_HUB)])
    writeFileSync(
      path.join(root, MODULE, 'entrypoints.json'),
      JSON.stringify({
        entrypoints: {
          [BRIDGE_HUB]: {
            name: 'BridgeHub',
            type: 'Contract',
            project: MODULE,
          },
        },
      }),
    )
    mkdirSync(path.join(root, 'undiscovered'))
    writeFileSync(path.join(root, 'undiscovered', 'config.jsonc'), '{}')

    const sources = readUsageSources(new ConfigReader(root))

    expect(sources.map((x) => x.project)).toEqual(['abstract', MODULE])
    expect(buildAddressUsage(sources)).toEqual({
      sharedAddresses: {
        [BRIDGE_HUB]: [
          { project: 'abstract', name: undefined, viaModule: MODULE },
          { project: MODULE, name: 'BridgeHub', viaModule: undefined },
        ],
      },
      moduleConsumers: { [MODULE]: ['abstract'] },
      entrypoints: { [BRIDGE_HUB]: { name: 'BridgeHub', project: MODULE } },
    })
  })
})

function writeProject(root: string, name: string, entries: EntryParameters[]) {
  mkdirSync(path.join(root, name))
  writeFileSync(path.join(root, name, 'config.jsonc'), '{}')
  writeFileSync(
    path.join(root, name, 'discovered.json'),
    JSON.stringify(discovery(name, entries)),
  )
}

function source(
  project: string,
  entries: EntryParameters[],
  entrypoints?: UsageSource['entrypoints']['entrypoints'],
): UsageSource {
  return {
    project,
    discovery: discovery(project, entries),
    entrypoints: { entrypoints },
  }
}

function discovery(name: string, entries: EntryParameters[]): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    entries,
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    modelledAgainst: {},
    usedBlockNumbers: {},
  }
}

function contract(
  name: string,
  address: ChainSpecificAddress,
): EntryParameters {
  return { type: 'Contract', name, address }
}

function reference(
  address: ChainSpecificAddress,
  targetProject: string,
): EntryParameters {
  return { type: 'Reference', address, targetProject }
}
