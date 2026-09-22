/**
 * Assembles the V1 `EntryParameters` object and the V2 side file.
 *
 * The entry must be indistinguishable from what V1's `processAnalysis`
 * writes for the same contract, key order included, because V1's diff,
 * frontend and permission tooling consume it unchanged. Every V1 fact comes
 * from `prepared` (proxy, sources, deployment), the values are the union of
 * proxy `$` values, baseline getters and plan fields in V1's merge order, and
 * the V1 helpers (`recalculateSourceHashes`, `getImplementationNames`,
 * `sortByKeys`, `withoutUndefinedKeys`) are called rather than imitated.
 *
 * Relatives are returned, not written: the traversal that would consume them
 * is V1's engine, and this package stops at one address.
 */
import {
  type ContractSources,
  type ContractValue,
  type EntryParameters,
  get$Beacons,
  get$Implementations,
  get$PastUpgrades,
  getImplementationNames,
  type PerContractSource,
  recalculateSourceHashes,
  sortByKeys,
  toAddressArray,
} from '@l2beat/discovery'
import {
  type ChainSpecificAddress,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import type { Executed } from '../execute/executePlan'
import type { Plan } from '../plan/Plan'
import type { Baseline } from '../types/Baseline'
import type { EntryMeta, PlanStatus } from '../types/EntryMeta'
import type { Prepared } from '../types/Prepared'

export interface EntryMetaInput {
  planStatus: PlanStatus
  planHash?: string
  decisionHash?: string
  model?: string
  /** The executed plan, for step and skip counts; absent when no plan exists. */
  plan?: Pick<Plan, 'steps' | 'skips'>
}

export interface EntryOutput {
  entry: EntryParameters
  meta: EntryMeta
  relatives: ChainSpecificAddress[]
}

export function toEntry(
  prepared: Prepared,
  baseline: Baseline,
  executed: Executed,
  meta: EntryMetaInput,
): EntryOutput {
  const values = prepared.isEOA
    ? {}
    : {
        ...prepared.proxy.values,
        ...valuesOf(baseline),
        ...valuesOf(executed),
      }
  const errors = prepared.isEOA
    ? {}
    : { ...errorsOf(baseline), ...errorsOf(executed) }

  return {
    entry: prepared.isEOA
      ? eoaEntry(prepared)
      : contractEntry(prepared, values, errors),
    meta: buildMeta(prepared, executed, meta),
    relatives: relativesOf(prepared, values),
  }
}

function eoaEntry(prepared: Prepared): EntryParameters {
  return withoutUndefinedKeys({
    address: prepared.address,
    type: 'EOA',
    proxyType: prepared.proxy.type,
  })
}

/** Same literal key order as V1's `processAnalysis`, so serialised entries diff cleanly. */
function contractEntry(
  prepared: Prepared,
  values: Record<string, ContractValue | undefined>,
  errors: Record<string, string>,
): EntryParameters {
  const sources = toPerContractSources(prepared)
  return withoutUndefinedKeys({
    name: prepared.name,
    address: prepared.address,
    type: 'Contract',
    unverified: prepared.isVerified ? undefined : true,
    sourceHashes: recalculateSourceHashes(sources),
    proxyType: prepared.proxy.type,
    deployerAddress: prepared.deployment?.deployer,
    sinceTimestamp: prepared.deployment?.timestamp,
    sinceBlock: prepared.deployment?.blockNumber,
    values: Object.keys(values).length === 0 ? undefined : sortByKeys(values),
    errors: Object.keys(errors).length === 0 ? undefined : sortByKeys(errors),
    implementationNames:
      (prepared.implementationNames as EntryParameters['implementationNames']) ??
      getImplementationNames(
        prepared.address,
        toContractSources(prepared, sources),
      ),
  } satisfies EntryParameters)
}

function valuesOf(source: {
  fields: Record<string, { value?: ContractValue }>
}): Record<string, ContractValue> {
  return Object.fromEntries(
    Object.entries(source.fields).flatMap(([name, field]) =>
      field.value === undefined ? [] : [[name, field.value]],
    ),
  )
}

function errorsOf(source: {
  fields: Record<string, { error?: string }>
}): Record<string, string> {
  return Object.fromEntries(
    Object.entries(source.fields).flatMap(([name, field]) =>
      field.error === undefined ? [] : [[name, field.error]],
    ),
  )
}

/**
 * Every address any value mentions, minus this contract and the proxy
 * machinery (implementations, beacons, past upgrades) that V1's
 * `AddressAnalyzer` also keeps out of the traversal.
 */
function relativesOf(
  prepared: Prepared,
  values: Record<string, ContractValue | undefined>,
): ChainSpecificAddress[] {
  const proxyValues = prepared.proxy.values
  const ignored = new Set<string>([
    prepared.address,
    ...get$Implementations(proxyValues),
    ...get$Beacons(proxyValues),
    ...get$PastUpgrades(proxyValues).flatMap((upgrade) => upgrade[2]),
  ])
  const found = toAddressArray(values as ContractValue).filter(
    (address) => !ignored.has(address),
  )
  return [...new Set(found)].sort()
}

function buildMeta(
  prepared: Prepared,
  executed: Executed,
  meta: EntryMetaInput,
): EntryMeta {
  return withoutUndefinedKeys({
    version: 1,
    planStatus: meta.planStatus,
    planHash: meta.planHash,
    decisionHash: meta.decisionHash,
    shapeHash: prepared.shapeHash,
    stepCount: meta.plan?.steps.length ?? 0,
    failedSteps: Object.entries(executed.fields)
      .filter(([, field]) => field.error !== undefined)
      .map(([id]) => id),
    skipCount: meta.plan?.skips.length ?? 0,
    model: meta.model,
  })
}

/**
 * V1's source helpers read `hash`, `name` and `address`; the `source` member
 * is filled from what `prepared` carries so the objects are honest, but no
 * V1 code path used here looks inside it.
 */
function toPerContractSources(prepared: Prepared): PerContractSource[] {
  return prepared.sources.map((source) => ({
    hash: source.hash,
    name: source.name,
    address: source.address,
    source: {
      name: source.name,
      rootFile: undefined,
      isVerified: source.hash !== undefined,
      abi: prepared.abis[source.address.toString()] ?? [],
      solidityVersion: source.solidityVersion,
      constructorArguments: source.constructorArguments,
      files: {},
      remappings: [],
      libraries: {},
    },
  }))
}

function toContractSources(
  prepared: Prepared,
  sources: PerContractSource[],
): ContractSources {
  return {
    name: prepared.name,
    isVerified: prepared.isVerified,
    abi: prepared.abi,
    abis: prepared.abis,
    sources,
  }
}
