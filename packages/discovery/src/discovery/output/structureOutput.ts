import {
  type Hash256,
  fromParts,
  undefinedIfEmpty,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import { getChainShortName } from '../../config/config.discovery'
import { recalculateSourceHashes } from '../../flatten/utils'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { hashJsonStable } from '../config/hashJsonStable'
import {
  migrateImplementationNames,
  migrateValues,
} from './chainSpecificMigration'
import type { EntryParameters, StructureOutput } from './types'
import { StructureConfig } from '../config/StructureConfig'

export function getStructureOutput(
  config: StructureConfig,
  blockNumber: number,
  results: Analysis[],
): StructureOutput {
  return withoutUndefinedKeys({
    name: config.name,
    chain: config.chain,
    blockNumber,
    configHash: hashJsonStable(config),
    sharedModules: undefinedIfEmpty(config.sharedModules),
    ...processAnalysis(results, config.chain),
    usedTemplates: collectUsedTemplatesWithHashes(results),
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
  chain: string,
): Pick<StructureOutput, 'entries' | 'abis'> {
  const shortChainName = getChainShortName(chain)
  const { contracts, abis } = getEntries(results)

  return {
    entries: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x): EntryParameters => {
        return withoutUndefinedKeys({
          name: x.name,
          address: fromParts(shortChainName, x.address),
          type: x.type,
          unverified: x.isVerified ? undefined : true,
          template: x.extendedTemplate?.template,
          sourceHashes: x.isVerified
            ? recalculateSourceHashes(x.sourceBundles)
            : undefined,
          proxyType: x.proxyType,
          ignoreInWatchMode: x.ignoreInWatchMode,
          sinceTimestamp: x.deploymentTimestamp,
          sinceBlock: x.deploymentBlockNumber,
          values:
            Object.keys(x.values).length === 0
              ? undefined
              : sortByKeys(migrateValues(x.values, shortChainName)),
          errors:
            Object.keys(x.errors).length === 0
              ? undefined
              : sortByKeys(x.errors),
          implementationNames: migrateImplementationNames(
            x.implementationNames,
            shortChainName,
          ),
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
