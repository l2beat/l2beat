/**
 * The committed side of the benchmark: the suite, a project's committed
 * `discovered.json`, its config and its templates, read through V1's own
 * classes.
 *
 * `ConfigReader` resolves `import`s, `TemplateService` parses
 * `template.jsonc`, and `makeEntryStructureConfig` + `pushValues` is the very
 * merge `AddressAnalyzer` performs (template first, then the address
 * override on top). Reimplementing any of it here would let the benchmark
 * attribute a field to the wrong origin and blame the model for a config
 * quirk, so the V1 code is called instead.
 */
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { TemplateService } from '../../analysis/TemplateService'
import { ConfigReader } from '../../config/ConfigReader'
import {
  makeEntryStructureConfig,
  type StructureContractConfig,
} from '../../config/structureUtils'
import type { DiscoveryOutput, EntryParameters } from '../../output/types'
import suiteJson from './suite.json'
import type { EffectiveConfig } from './types'

export type SuiteProject = v.infer<typeof SuiteProject>
export const SuiteProject = v.object({
  name: v.string(),
  chain: v.string(),
  /** Leave out to run every verified contract of the project that has a template. */
  addresses: v.array(v.string()).optional(),
})

/** One contract of the quick suite, chosen for dense use of the handlers the model is offered. */
export type QuickContract = v.infer<typeof QuickContract>
export const QuickContract = v.object({
  project: v.string(),
  chain: v.string(),
  address: v.string(),
  /** The committed template, for the reader; the run hides whatever the entry names. */
  template: v.string(),
  /** Handler fields the model could not have written, with the reason, so a miss there is expected. */
  unreachable: v.record(v.string(), v.string()).optional(),
})

export type BenchmarkSuite = v.infer<typeof BenchmarkSuite>
export const BenchmarkSuite = v.object({
  description: v.string().optional(),
  /** The default: fourteen contracts that run in about half an hour. */
  quick: v.array(QuickContract),
  /** The research suite, for comparability with the research numbers. */
  projects: v.array(SuiteProject),
})

export type SuiteName = 'quick' | 'full'

export function readSuite(): BenchmarkSuite {
  return BenchmarkSuite.parse(suiteJson)
}

/**
 * The quick suite as projects with address lists, one per project in the
 * order contracts are listed, so it runs through the same code as the full
 * suite. `names` restricts it to some projects.
 */
export function quickSuiteProjects(
  suite: BenchmarkSuite,
  names: readonly string[],
): SuiteProject[] {
  const projects: SuiteProject[] = []
  for (const contract of suite.quick) {
    const project = projects.find((p) => p.name === contract.project)
    if (project === undefined) {
      projects.push({
        name: contract.project,
        chain: contract.chain,
        addresses: [contract.address],
      })
    } else {
      project.addresses?.push(contract.address)
    }
  }
  if (names.length === 0) {
    return projects
  }
  return names.map((name) => {
    const project = projects.find((p) => p.name === name)
    if (project === undefined) {
      const known = projects.map((p) => p.name).join(', ')
      throw new Error(`${name} is not in the quick suite (suite: ${known})`)
    }
    return project
  })
}

/** The quick suite's unreachable fields by lowercased address, for the comparison. */
export function quickUnreachable(
  suite: BenchmarkSuite,
): Record<string, Record<string, string>> {
  return Object.fromEntries(
    suite.quick
      .filter((contract) => contract.unreachable !== undefined)
      .map((contract) => [
        contract.address.toLowerCase(),
        contract.unreachable as Record<string, string>,
      ]),
  )
}

/** The suite's projects by name, in the order asked; every project when none is asked for. */
export function selectSuiteProjects(
  suite: BenchmarkSuite,
  names: readonly string[],
): SuiteProject[] {
  if (names.length === 0) {
    return suite.projects
  }
  return names.map((name) => {
    const project = suite.projects.find((p) => p.name === name)
    if (project === undefined) {
      const known = suite.projects.map((p) => p.name).join(', ')
      throw new Error(`${name} is not in the suite (suite: ${known})`)
    }
    return project
  })
}

export type TemplatedEntry = EntryParameters & { template: string }

export interface BenchmarkProject {
  name: string
  chain: string
  /** The committed timestamp: `--dev` builds its provider from it, and so does the benchmark. */
  timestamp: UnixTime
  /** The committed `usedBlockNumbers[chain]`: the block every committed value was read at. */
  blockNumber: number
  /** Every entry of the committed `discovered.json`, in its order. */
  entries: EntryParameters[]
  /** The address's config before any template, as the engine hands it to the analyzer. */
  entryConfig(address: ChainSpecificAddress): StructureContractConfig
  /** What the committed template made of that config. */
  committedConfig(entry: TemplatedEntry): EffectiveConfig
}

export function loadProject(
  discoveryPath: string,
  suiteProject: SuiteProject,
): BenchmarkProject {
  const reader = new ConfigReader(discoveryPath)
  const templates = new TemplateService(discoveryPath)
  const discovered = reader.readDiscovery(suiteProject.name)
  const structure = reader.readConfig(suiteProject.name).structure
  return {
    name: suiteProject.name,
    chain: suiteProject.chain,
    timestamp: UnixTime(discovered.timestamp),
    blockNumber: committedBlock(discovered, suiteProject),
    entries: discovered.entries,
    entryConfig: (address) => makeEntryStructureConfig(structure, address),
    committedConfig(entry) {
      const override = makeEntryStructureConfig(structure, entry.address)
      const overrideFields = Object.entries(override.fields)
        .filter(
          ([, field]) =>
            field.handler !== undefined || field.copy !== undefined,
        )
        .map(([name]) => name)
      const merged = makeEntryStructureConfig(structure, entry.address)
      merged.pushValues(templates.loadContractTemplate(entry.template))
      return {
        fields: merged.fields,
        ignoreMethods: merged.ignoreMethods,
        overrideFields,
      }
    },
  }
}

function committedBlock(
  discovered: DiscoveryOutput,
  { name, chain }: SuiteProject,
): number {
  const block = discovered.usedBlockNumbers[chain]
  if (block === undefined) {
    const known = Object.keys(discovered.usedBlockNumbers).join(', ')
    throw new Error(
      `${name}/discovered.json has no usedBlockNumbers entry for ${chain} (has: ${known || 'none'})`,
    )
  }
  return block
}

export interface ContractSelection {
  /** The suite's list for the project. */
  addresses?: readonly string[]
  /** A further restriction from the command line, for smoke runs. */
  onlyAddresses?: readonly string[]
  /** First n contracts after the other filters, for smoke runs. */
  limit?: number
}

/**
 * Only a verified contract with a committed template can be benchmarked:
 * without a template there is nothing to hide and compare against, an EOA
 * or a `Reference` has no template, and unverified code cannot be
 * templatized at all.
 */
export function selectContracts(
  entries: readonly EntryParameters[],
  chain: string,
  selection: ContractSelection,
): TemplatedEntry[] {
  const inSuite = addressFilter(chain, selection.addresses)
  const inRestriction = addressFilter(chain, selection.onlyAddresses)
  const selected = entries.filter(
    (entry): entry is TemplatedEntry =>
      entry.type === 'Contract' &&
      entry.unverified !== true &&
      entry.template !== undefined &&
      ChainSpecificAddress.longChain(entry.address) === chain &&
      inSuite(entry.address) &&
      inRestriction(entry.address),
  )
  return selection.limit === undefined
    ? selected
    : selected.slice(0, selection.limit)
}

/**
 * The suite's addresses for the project that its committed discovery does
 * not hold as a verified contract with a template. The suite is a list
 * into committed discovery, which moves on, and such a contract would drop
 * out of the run silently, making it smaller than the suite says.
 */
export function missingFromSuite(
  project: Pick<BenchmarkProject, 'entries' | 'chain'>,
  suiteProject: SuiteProject,
): string[] {
  const listed = suiteProject.addresses ?? []
  const found = new Set(
    selectContracts(project.entries, project.chain, { addresses: listed }).map(
      (entry) => entry.address.toLowerCase(),
    ),
  )
  return listed.filter((raw) => !found.has(parseAddress(project.chain, raw)))
}

function addressFilter(
  chain: string,
  addresses: readonly string[] | undefined,
): (address: ChainSpecificAddress) => boolean {
  if (addresses === undefined) {
    return () => true
  }
  const wanted = new Set(addresses.map((raw) => parseAddress(chain, raw)))
  return (address) => wanted.has(address.toLowerCase())
}

/** `0x…` or `eth:0x…`, lowercased, since the suite and the command line need not use checksums. */
function parseAddress(chain: string, raw: string): string {
  const trimmed = raw.trim()
  const address = trimmed.includes(':')
    ? ChainSpecificAddress(trimmed)
    : ChainSpecificAddress.fromLong(chain, trimmed)
  return address.toLowerCase()
}
