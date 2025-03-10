import type { Hash256 } from '@l2beat/shared-pure'
import type { DiscoveryOutput, EntryParameters } from './types'

import type { Analysis } from '../analysis/AddressAnalyzer'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'
import { resolveAnalysis } from '../permission-resolving/resolveAnalysis'
import {
  transformToIssued,
  transformToReceived,
} from '../permission-resolving/transform'
import { neuterErrors } from './errors'

export function toDiscoveryOutput(
  config: DiscoveryConfig,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  const discovery = toRawDiscoveryOutput(config, blockNumber, results)

  discovery.entries.forEach((e) => {
    if (e.errors !== undefined) {
      e.errors = sortByKeys(neuterErrors(e.errors))
    }
  })

  return discovery
}

export function toRawDiscoveryOutput(
  config: DiscoveryConfig,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  return withoutUndefinedKeys({
    name: config.name,
    chain: config.chain,
    blockNumber,
    configHash: config.hash,
    sharedModules: undefinedIfEmpty(config.sharedModules),
    ...processAnalysis(results),
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
): Pick<DiscoveryOutput, 'entries' | 'abis'> {
  const resolvedPermissions = resolveAnalysis(results)

  const { contracts, abis } = getEntries(results)
  return {
    entries: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x): EntryParameters => {
        const displayName = x.combinedMeta?.displayName
        const { directlyReceivedPermissions, receivedPermissions } =
          transformToReceived(
            x.address,
            resolvedPermissions,
            x.combinedMeta?.permissions,
          )

        const references = undefinedIfEmpty([
          ...(x.selfMeta?.references ?? []),
          ...(x.references ?? []),
        ])

        return withoutUndefinedKeys({
          type: x.type,
          name: x.name,
          address: x.address,
          unverified: x.isVerified ? undefined : true,
          template: x.extendedTemplate?.template,
          sourceHashes: x.isVerified
            ? x.sourceBundles.map((b) => b.hash as string)
            : undefined,
          proxyType: x.proxyType,
          displayName:
            displayName && displayName !== x.name ? displayName : undefined,
          description: x.combinedMeta?.description,
          types: setToSortedArray(x.combinedMeta?.types),
          severity: x.combinedMeta?.severity,
          issuedPermissions: transformToIssued(x.address, resolvedPermissions),
          receivedPermissions,
          directlyReceivedPermissions,
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
          fieldMeta:
            Object.keys(x.fieldsMeta).length > 0 ? x.fieldsMeta : undefined,
          derivedName: x.derivedName,
          usedTypes: x.usedTypes?.length === 0 ? undefined : x.usedTypes,
          references,
          category: x.category,
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

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

function undefinedIfEmpty<T>(array: T[]): T[] | undefined {
  if (array.length === 0) {
    return undefined
  }

  return array
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}

function setToSortedArray<T>(value: Set<T> | undefined): T[] | undefined {
  return value && Array.from(value).sort()
}
