/**
 * The V1 side of the benchmark: a project's committed `discovered.json`,
 * its config and its templates, read through V1's own classes.
 *
 * `ConfigReader` resolves `import`s and `TemplateService` parses
 * `template.jsonc`, and `makeEntryStructureConfig` + `pushValues` is the very
 * merge `AddressAnalyzer` performs (template first, then the address
 * override on top, lodash `merge` semantics included). Reimplementing any of
 * it here would let the benchmark attribute a field to the wrong origin and
 * blame the model for a config quirk, so the V1 code is called instead.
 *
 * The block is the project's `usedBlockNumbers[chain]`: V1 read every value
 * at that block, and comparing V2 read at any other block would measure
 * chain activity, not the extractor.
 */
import {
  ConfigReader,
  type ContractConfig,
  type DiscoveryOutput,
  type EntryParameters,
  getDiscoveryPaths,
  makeEntryStructureConfig,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { parseAddress } from '../commands/files'

export type EffectiveConfig = Pick<ContractConfig, 'fields' | 'ignoreMethods'>

export interface BenchmarkProject {
  name: string
  chain: string
  blockNumber: number
  /** The `Contract` entries on `chain` that the benchmark will run, in `discovered.json` order. */
  entries: EntryParameters[]
  /** Template merged with the address override, as V1 applied it to this entry. */
  effectiveConfig(entry: EntryParameters): EffectiveConfig
}

export interface SelectOptions {
  limit?: number
  /** `0x…` or `eth:0x…`; restricts the run to these entries. */
  addresses?: string[]
}

export function loadV1Project(
  project: string,
  chain: string,
  selection: SelectOptions = {},
  discoveryPath: string = getDiscoveryPaths().discovery,
): BenchmarkProject {
  const reader = new ConfigReader(discoveryPath)
  const templates = new TemplateService(discoveryPath)
  const discovered = reader.readDiscovery(project)
  const config = reader.readConfig(project)
  const blockNumber = blockOf(discovered, chain, project)
  return {
    name: project,
    chain,
    blockNumber,
    entries: selectContracts(discovered.entries, chain, selection),
    effectiveConfig(entry) {
      const merged = makeEntryStructureConfig(config.structure, entry.address)
      if (entry.template !== undefined) {
        merged.pushValues(templates.loadContractTemplate(entry.template))
      }
      return { fields: merged.fields, ignoreMethods: merged.ignoreMethods }
    },
  }
}

/**
 * Only verified `Contract` entries are comparable: an EOA has no values, a
 * `Reference` points at another project's entry, and an unverified contract
 * gives V1 nothing but proxy values, which `prepare` reproduces trivially.
 */
export function selectContracts(
  entries: EntryParameters[],
  chain: string,
  selection: SelectOptions,
): EntryParameters[] {
  const wanted =
    selection.addresses === undefined
      ? undefined
      : new Set(
          selection.addresses.map((raw) => parseAddress(chain, raw).toString()),
        )
  const selected = entries.filter(
    (entry) =>
      entry.type === 'Contract' &&
      entry.unverified !== true &&
      ChainSpecificAddress.longChain(entry.address) === chain &&
      (wanted === undefined || wanted.has(entry.address.toString())),
  )
  return selection.limit === undefined
    ? selected
    : selected.slice(0, selection.limit)
}

function blockOf(
  discovered: DiscoveryOutput,
  chain: string,
  project: string,
): number {
  const block = discovered.usedBlockNumbers[chain]
  if (block === undefined) {
    const known = Object.keys(discovered.usedBlockNumbers).join(', ')
    throw new Error(
      `${project}/discovered.json has no usedBlockNumbers entry for ${chain} (has: ${known || 'none'})`,
    )
  }
  return block
}
