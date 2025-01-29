import { assert, EthereumAddress } from '@l2beat/shared-pure'

import {
  type ContractFieldSeverity,
  type ContractValue,
  type ContractValueType,
  type StackCategory,
  get$Admins,
  get$Implementations,
} from '@l2beat/discovery-types'
import { groupBy, uniqBy } from 'lodash'
import type { ContractConfig } from '../config/ContractConfig'
import type {
  DiscoveryContractField,
  ExternalReference,
  PermissionConfiguration,
  RawPermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import { resolveReferenceFromValues } from '../handlers/reference'
import { valueToNumber } from '../handlers/utils/valueToNumber'
import type { AnalyzedContract } from './AddressAnalyzer'

type AddressToMetaMap = { [address: string]: ContractMeta }

// using `| undefined` for strong type safety,
// making sure ever field of meta is always processed.
export interface ContractMeta {
  canActIndependently?: boolean
  displayName?: string
  description?: string
  permissions?: PermissionConfiguration[]
  categories?: Set<StackCategory>
  types?: Set<ContractValueType>
  severity?: ContractFieldSeverity
  references?: ExternalReference[]
}

export function mergeContractMeta(
  a?: ContractMeta,
  b?: ContractMeta,
): ContractMeta | undefined {
  const result: ContractMeta = {
    displayName: a?.displayName ?? b?.displayName,
    description: a?.description ?? b?.description,
    permissions: mergePermissions(a?.permissions, b?.permissions),
    categories: mergeSets(a?.categories, b?.categories),
    types: mergeSets(a?.types, b?.types),
    severity: findHighestSeverity(a?.severity, b?.severity),
    canActIndependently: mergeCanActIndependently(
      a?.canActIndependently,
      b?.canActIndependently,
    ),
    references: mergeReferences(a?.references, b?.references),
  }
  return isEmptyObject(result) ? undefined : result
}

export function mergeCanActIndependently(
  a?: boolean | undefined,
  b?: boolean | undefined,
): boolean | undefined {
  // Don't cast to false, undefined means we don't know
  if (a === undefined && b === undefined) {
    return undefined
  }
  return a ?? b
}

export function mergePermissions(
  a: PermissionConfiguration[] = [],
  b: PermissionConfiguration[] = [],
): PermissionConfiguration[] | undefined {
  const encodeKey = (v: PermissionConfiguration): string => {
    return `${v.type}-${v.target.toString()}-${v.condition ?? ''}`
  }

  const result: PermissionConfiguration[] = []
  const grouping = groupBy(a.concat(b), encodeKey)
  for (const key in grouping) {
    const allEntries = grouping[key] ?? []
    const highestDelay = allEntries.reduce(
      (a, b) => Math.max(a, b.delay),
      -Infinity,
    )
    const entries = allEntries.filter((e) => e.delay === highestDelay)

    const withDescription = entries.filter((e) => e.description !== undefined)
    if (withDescription.length > 0) {
      result.push(...withDescription)
    } else if (entries.length > 0) {
      const entry = entries.find((e) => e.description === undefined)
      assert(entry !== undefined)
      result.push(entry)
    }
  }

  return result.length === 0 ? undefined : result
}

export function interpolateString(
  description: string,
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): string {
  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value = key === '$.address' ? analysis.address : analysis.values[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract field not found in contract analysis`,
      )
    }
    return String(value)
  })
}

export function getSelfMeta(
  config: ContractConfig,
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): ContractMeta | undefined {
  let description: string | undefined = undefined
  if (config.description !== undefined) {
    description = interpolateString(config.description, analysis)
  }

  let references: ExternalReference[] | undefined
  const addresses = [analysis.address, ...get$Implementations(analysis.values)]

  for (const address of addresses) {
    const manualSourcePath = config.manualSourcePaths[address.toString()]
    if (manualSourcePath === undefined) {
      continue
    }

    references ??= []
    references.push({
      text: 'Source Code',
      href: manualSourcePath,
    })
  }

  const result = {
    canActIndependently: config.canActIndependently,
    displayName: config.displayName,
    description,
    references,
    permissions: undefined,
    categories: undefined,
    severity: undefined,
    types: undefined,
  }

  return isEmptyObject(result) ? undefined : result
}

export function getTargetsMeta(
  self: EthereumAddress,
  values: Record<string, ContractValue | undefined> = {},
  fields: { [address: string]: DiscoveryContractField } = {},
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): AddressToMetaMap | undefined {
  const result = getMetaFromUpgradeability(self, get$Admins(values))

  for (const [fieldName, value] of Object.entries(values)) {
    const field = fields[fieldName]
    const target = field?.target
    if (target) {
      for (const address of getAddresses(value)) {
        const meta = mergeContractMeta(
          result[address.toString()],
          targetConfigToMeta(self, field, target, analysis),
        )
        if (meta) {
          result[address.toString()] = meta
        }
      }
    }
  }

  return isEmptyObject(result) ? undefined : result
}

export function getMetaFromUpgradeability(
  self: EthereumAddress,
  admins: EthereumAddress[],
): AddressToMetaMap {
  const result: Record<string, ContractMeta> = {}
  for (const upgradeabilityAdmin of admins) {
    if (upgradeabilityAdmin !== undefined) {
      result[upgradeabilityAdmin.toString()] = {
        displayName: undefined,
        categories: undefined,
        description: undefined,
        severity: undefined,
        types: undefined,
        permissions: [{ type: 'upgrade', target: self, delay: 0 }],
      }
    }
  }
  return result
}

function targetConfigToMeta(
  self: EthereumAddress,
  field: DiscoveryContractField,
  target: DiscoveryContractField['target'],
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): ContractMeta | undefined {
  if (target === undefined) {
    return undefined
  }

  const result: ContractMeta = {
    displayName: undefined,
    description: undefined,
    permissions: target.permissions?.map((p) =>
      linkPermission(p, self, analysis.values, analysis),
    ),
    categories: toSet(target.category),
    types: toSet(field.type),
    severity: Array.from(toSet(field.severity) ?? [])[0],
  }
  return isEmptyObject(result) ? undefined : result
}

function linkPermission(
  rawPermission: RawPermissionConfiguration,
  self: EthereumAddress,
  values: AnalyzedContract['values'],
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): PermissionConfiguration {
  let delay = rawPermission.delay
  if (typeof delay === 'string') {
    delay = valueToNumber(resolveReferenceFromValues(delay, values))
  }

  return {
    type: rawPermission.type,
    delay,
    description: rawPermission.description
      ? interpolateString(rawPermission.description, analysis)
      : undefined,
    condition: rawPermission.condition
      ? interpolateString(rawPermission.condition, analysis)
      : undefined,
    target: self,
  }
}

export function invertMeta(
  targetsMeta: AnalyzedContract['targetsMeta'][],
): AddressToMetaMap {
  const result: AddressToMetaMap = {}

  targetsMeta
    .filter(isDefined)
    .flatMap((v) => Object.entries(v))
    .forEach(([targetAddress, targetMeta]) => {
      const merged = mergeContractMeta(result[targetAddress], targetMeta)
      if (merged) {
        result[targetAddress] = merged
      }
    })

  return result
}

function toSet<T>(value: T | T[] | undefined): Set<T> | undefined {
  if (value === undefined) {
    return undefined
  }
  if (Array.isArray(value)) {
    return new Set([...value])
  }
  return new Set([value])
}

function mergeSets<T>(
  a: Set<T> | undefined,
  b: Set<T> | undefined,
): Set<T> | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  return new Set([...(a ?? []), ...(b ?? [])])
}

export function mergeReferences(
  a: ExternalReference[] | undefined,
  b: ExternalReference[] | undefined,
): ExternalReference[] | undefined {
  const result = uniqBy([...(a ?? []), ...(b ?? [])], (v) => JSON.stringify(v))
  return result.length > 0 ? result : undefined
}

export function findHighestSeverity(
  a: ContractFieldSeverity | undefined,
  b: ContractFieldSeverity | undefined,
): ContractFieldSeverity | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  if (a === 'HIGH' || b === 'HIGH') {
    return 'HIGH'
  }
  if (a === 'MEDIUM' || b === 'MEDIUM') {
    return 'MEDIUM'
  }
  return 'LOW'
}

function isEmptyObject(obj: object): boolean {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined || value === false)
  )
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function getAddresses(
  value: ContractValue | undefined,
): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => getAddresses(v))
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v))
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}
