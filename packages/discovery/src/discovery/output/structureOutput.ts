import {
  type Hash256,
  type UnixTime,
  undefinedIfEmpty,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import { recalculateSourceHashes } from '../../flatten/utils'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { hashJsonStable } from '../config/hashJsonStable'
import type { StructureConfig } from '../config/StructureConfig'
import type { EntryParameters, StructureOutput } from './types'

export function getStructureOutput(
  config: StructureConfig,
  timestamp: UnixTime,
  usedBlockNumbers: Record<string, number>,
  results: Analysis[],
): StructureOutput {
  return withoutUndefinedKeys({
    name: config.name,
    chain: config.chain,
    timestamp,
    configHash: hashJsonStable(config),
    sharedModules: undefinedIfEmpty(config.sharedModules),
    ...processAnalysis(results),
    usedTemplates: collectUsedTemplatesWithHashes(results),
    usedBlockNumbers,
  })
}

function collectUsedTemplatesWithHashes(
  results: Analysis[],
): Record<string, Hash256> {
  const entries: [string, Hash256][] = results
    .map((contract) => contract.extendedTemplate)
    .filter((t) => t !== undefined)
    .map((t) => [t.template, t.templateHash])
  entries.sort((a, b) => a[0].localeCompare(b[0]))
  return Object.fromEntries(entries)
}

export function processAnalysis(
  results: Analysis[],
): Pick<StructureOutput, 'entries' | 'abis'> {
  const { contracts, abis } = getEntries(results)

  return {
    entries: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x): EntryParameters => {
        return withoutUndefinedKeys({
          name: x.name,
          address: x.address,
          type: x.type,
          unverified: x.isVerified ? undefined : true,
          template: x.extendedTemplate?.template,
          sourceHashes: recalculateSourceHashes(x.sourceBundles),
          proxyType: x.proxyType,
          ignoreInWatchMode: x.ignoreInWatchMode,
          sinceTimestamp: x.deploymentTimestamp,
          sinceBlock: x.deploymentBlockNumber,
          values:
            Object.keys(x.values).length === 0
              ? undefined
              : sortByKeys(x.values),
          errors:
            Object.keys(x.errors).length === 0
              ? undefined
              : sortByKeys(x.errors),
          implementationNames: x.implementationNames,
          usedTypes: x.usedTypes?.length === 0 ? undefined : x.usedTypes,
        } satisfies EntryParameters)
      }),
    abis,
  }
}

function getEntries(results: Analysis[]): {
  contracts: Analysis[]
  abis: Record<string, string[]>
} {
  let abis: Record<string, string[]> = {}
  const contracts: Analysis[] = []
  for (const result of results) {
    contracts.push(result)
    abis = { ...abis, ...result.abis }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )
  return { contracts, abis }
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}
