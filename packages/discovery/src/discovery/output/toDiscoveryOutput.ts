import {
  ContractParameters,
  DiscoveryOutput,
  EoaParameters,
} from '@l2beat/discovery-types'
import { Hash256 } from '@l2beat/shared-pure'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { resolveAnalysis } from '../permission-resolving/resolveAnalysis'
import {
  transformToIssued,
  transformToReceived,
} from '../permission-resolving/transform'

export function toDiscoveryOutput(
  name: string,
  chain: string,
  configHash: Hash256,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  return {
    name,
    chain,
    blockNumber,
    configHash,
    ...processAnalysis(results),
    usedTemplates: collectUsedTemplatesWithHashes(results),
  }
}

export function collectUsedTemplatesWithHashes(
  results: Analysis[],
): Record<string, Hash256> {
  const entries: [string, Hash256][] = results
    .filter((a): a is AnalyzedContract => a.type === 'Contract')
    .map((contract) => contract.extendedTemplate)
    .filter((t) => t !== undefined)
    .map((t) => [t.template, t.templateHash])
  entries.sort((a, b) => a[0].localeCompare(b[0]))
  return Object.fromEntries(entries)
}

export function processAnalysis(
  results: Analysis[],
): Pick<DiscoveryOutput, 'contracts' | 'eoas' | 'abis'> {
  // DO NOT CHANGE BELOW CODE UNLESS YOU KNOW WHAT YOU ARE DOING!
  // CHANGES MIGHT TRIGGER UPDATE MONITOR FALSE POSITIVES!

  const resolvedPermissions = resolveAnalysis(results)

  const { contracts, abis } = getContracts(results)
  return {
    contracts: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x): ContractParameters => {
        const displayName = x.combinedMeta?.displayName
        const { directlyReceivedPermissions, receivedPermissions } =
          transformToReceived(
            x.address,
            resolvedPermissions,
            x.combinedMeta?.permissions,
          )
        return withoutUndefinedKeys({
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
          categories: setToSortedArray(x.combinedMeta?.categories),
          types: setToSortedArray(x.combinedMeta?.types),
          severity: x.combinedMeta?.severity,
          issuedPermissions: transformToIssued(x.address, resolvedPermissions),
          receivedPermissions,
          directlyReceivedPermissions,
          ignoreInWatchMode: x.ignoreInWatchMode,
          sinceTimestamp: x.deploymentTimestamp?.toNumber(),
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
        } satisfies ContractParameters)
      }),
    eoas: results
      .filter((x) => x.type === 'EOA')
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x) => {
        const { directlyReceivedPermissions, receivedPermissions } =
          transformToReceived(
            x.address,
            resolvedPermissions,
            x.combinedMeta?.permissions,
          )
        return {
          name: x.name,
          address: x.address,
          description: x.combinedMeta?.description,
          categories: setToSortedArray(x.combinedMeta?.categories),
          types: setToSortedArray(x.combinedMeta?.types),
          severity: x.combinedMeta?.severity,
          issuedPermissions: transformToIssued(x.address, resolvedPermissions),
          receivedPermissions,
          directlyReceivedPermissions,
        } satisfies EoaParameters
      }),
    abis,
  }
}

function getContracts(results: Analysis[]): {
  contracts: AnalyzedContract[]
  abis: Record<string, string[]>
} {
  let abis: Record<string, string[]> = {}
  const contracts: AnalyzedContract[] = []
  for (const result of results) {
    if (result.type === 'Contract') {
      contracts.push(result)
      abis = { ...abis, ...result.abis }
    }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )
  return { contracts, abis }
}

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}

function setToSortedArray<T>(value: Set<T> | undefined): T[] | undefined {
  return value && Array.from(value).sort()
}
