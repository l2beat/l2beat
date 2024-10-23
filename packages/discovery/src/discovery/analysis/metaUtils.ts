import { EthereumAddress } from '@l2beat/shared-pure'

import {
  ContractFieldSeverity,
  ContractValue,
  ContractValueType,
  StackCategory,
  get$Admins,
} from '@l2beat/discovery-types'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import {
  DiscoveryContractField,
  PermissionConfiguration,
  RawPermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import { resolveReferenceFromValues } from '../handlers/reference'
import { valueToNumber } from '../handlers/utils/valueToNumber'
import { AnalyzedContract } from './AddressAnalyzer'

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
    canActIndependently:
      (a?.canActIndependently ?? false) || (b?.canActIndependently ?? false),
  }
  return isEmptyObject(result) ? undefined : result
}

export function mergePermissions(
  a: PermissionConfiguration[] = [],
  b: PermissionConfiguration[] = [],
): PermissionConfiguration[] | undefined {
  const encodeKey = (v: PermissionConfiguration): string => {
    return `${v.type}-${v.target.toString()}`
  }

  const accumulator: Map<string, PermissionConfiguration> = new Map()
  for (const entry of a.concat(b)) {
    const key = encodeKey(entry)
    const comparisonEntry = accumulator.get(key) ?? entry
    if (comparisonEntry.delay <= entry.delay) {
      accumulator.set(key, entry)
    }
  }

  const result = [...accumulator.values()]
  return result.length === 0 ? undefined : result
}

export function interpolateDescription(
  description: string,
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): string {
  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value = key === '$.address' ? analysis.address : analysis.values[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract description not found in contract analysis`,
      )
    }
    return String(value)
  })
}

export function getSelfMeta(
  overrides: ContractOverrides | undefined,
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): ContractMeta | undefined {
  if (overrides?.description === undefined) {
    return undefined
  }
  const description = interpolateDescription(overrides?.description, analysis)
  return {
    canActIndependently: overrides.canActIndependently,
    displayName: overrides.displayName ?? undefined,
    description,
    permissions: undefined,
    categories: undefined,
    severity: undefined,
    types: undefined,
  }
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

export function targetConfigToMeta(
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
      ? interpolateDescription(rawPermission.description, analysis)
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

export function toSet<T>(value: T | T[] | undefined): Set<T> | undefined {
  if (value === undefined) {
    return undefined
  }
  if (Array.isArray(value)) {
    return new Set([...value])
  }
  return new Set([value])
}

export function mergeSets<T>(
  a: Set<T> | undefined,
  b: Set<T> | undefined,
): Set<T> | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  return new Set([...(a ?? []), ...(b ?? [])])
}

export function concatArrays<T>(
  a: T[] | undefined,
  b: T[] | undefined,
): T[] | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  return [...(a ?? []), ...(b ?? [])]
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
