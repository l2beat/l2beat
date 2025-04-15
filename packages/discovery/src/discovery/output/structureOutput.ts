import { type Hash256, undefinedIfEmpty } from '@l2beat/shared-pure'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { StructureConfig } from '../config/StructureConfig'
import { hashJsonStable } from '../config/hashJsonStable'
import { resolveAnalysis } from '../permission-resolving/resolveAnalysis'
import {
  transformToIssued,
  transformToReceived,
} from '../permission-resolving/transform'
import type {
  EntryParameters,
  ReceivedPermission,
  StructureOutput,
} from './types'

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
): Pick<StructureOutput, 'entries' | 'abis'> {
  const resolvedPermissions = resolveAnalysis(results)

  const { contracts, abis } = getEntries(results)
  return {
    entries: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x): EntryParameters => {
        const { directlyReceivedPermissions, receivedPermissions } =
          transformToReceived(
            x.address,
            resolvedPermissions,
            x.combinedMeta?.permissions,
          )

        return withoutUndefinedKeys({
          address: x.address,
          type: x.type,
          unverified: x.isVerified ? undefined : true,
          template: x.extendedTemplate?.template,
          sourceHashes: x.isVerified
            ? undefinedIfEmpty(x.sourceBundles.map((b) => b.hash as string))
            : undefined,
          proxyType: x.proxyType,
          issuedPermissions: transformToIssued(x.address, resolvedPermissions),
          receivedPermissions: receivedPermissions
            ? sortReceivedPermissionsByPermissionThenFromThenDescription(
                receivedPermissions,
              )
            : undefined,
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
          derivedName: x.derivedName,
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

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}

export function sortReceivedPermissionsByPermissionThenFromThenDescription(
  p: ReceivedPermission[],
) {
  return p.sort((a, b) => {
    if (a.permission === b.permission) {
      if (a.from === b.from) {
        return (a.description ?? '').localeCompare(b.description ?? '')
      }
      return a.from.localeCompare(b.from)
    }
    return a.permission.localeCompare(b.permission)
  })
}
