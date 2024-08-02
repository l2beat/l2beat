import { EthereumAddress } from '@l2beat/shared-pure'

import {
  ContractFieldSeverity,
  ContractValue,
  ContractValueType,
  Permission,
  StackCategory,
  StackRole,
  get$Admins,
} from '@l2beat/discovery-types'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryContractField } from '../config/RawDiscoveryConfig'
import { AnalyzedContract } from './AddressAnalyzer'

type AddressToMetaMap = { [address: string]: ContractMeta }

// using `| undefined` for strong type safety,
// making sure ever field of meta is always processed.
export interface ContractMeta {
  displayName: string | undefined
  descriptions: string[] | undefined
  roles: Set<StackRole> | undefined
  permissions: { [permission: string]: Set<EthereumAddress> } | undefined
  categories: Set<StackCategory> | undefined
  types: Set<ContractValueType> | undefined
  severity: ContractFieldSeverity | undefined
}

export function mergeContractMeta(
  a?: ContractMeta,
  b?: ContractMeta,
): ContractMeta | undefined {
  const result: ContractMeta = {
    displayName: a?.displayName ?? b?.displayName,
    descriptions: concatArrays(a?.descriptions, b?.descriptions),
    roles: mergeSets(a?.roles, b?.roles),
    permissions: mergePermissions(a?.permissions, b?.permissions),
    categories: mergeSets(a?.categories, b?.categories),
    types: mergeSets(a?.types, b?.types),
    severity: findHighestSeverity(a?.severity, b?.severity),
  }
  return isEmptyObject(result) ? undefined : result
}

export function mergePermissions(
  a: ContractMeta['permissions'] = {},
  b: ContractMeta['permissions'] = {},
): ContractMeta['permissions'] | undefined {
  const result: ContractMeta['permissions'] = {}
  const combinedKeys = new Set([
    ...Object.keys(a ?? {}),
    ...Object.keys(b ?? {}),
  ])
  for (const key of combinedKeys) {
    const merged = mergeSets(a[key], b[key])
    if (merged !== undefined) {
      result[key] = merged
    }
  }
  return isEmptyObject(result) ? undefined : result
}

export function interpolateDescription(
  description: string,
  analysis: Omit<AnalyzedContract, 'selfMeta' | 'targetsMeta'>,
): string {
  return description.replace(/\{\{\s*(#?\w+)\s*\}\}/g, (_match, key) => {
    const value = key === '#address' ? analysis.address : analysis.values[key]
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
    displayName: overrides.displayName ?? undefined,
    descriptions: [description],
    roles: undefined,
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
      const permission: Permission = 'admin'
      result[upgradeabilityAdmin.toString()] = {
        displayName: undefined,
        categories: undefined,
        descriptions: undefined,
        roles: undefined,
        severity: undefined,
        types: undefined,
        permissions: {
          [permission]: new Set([self]),
        },
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
  const descriptions = target.description
    ? [interpolateDescription(target.description, analysis)]
    : undefined

  const result: ContractMeta = {
    displayName: undefined,
    descriptions,
    roles: toSet(target.role),
    permissions: getTargetPermissions(self, toSet(target.permission)),
    categories: toSet(target.category),
    types: toSet(field.type),
    severity: Array.from(toSet(field.severity) ?? [])[0],
  }
  return isEmptyObject(result) ? undefined : result
}

export function getTargetPermissions(
  self: EthereumAddress,
  permission?: Set<Permission>,
): ContractMeta['permissions'] | undefined {
  if (permission === undefined) {
    return undefined
  }
  return Object.fromEntries([...permission].map((p) => [p, new Set([self])]))
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
    Object.values(obj).every((value) => value === undefined)
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
