import { EthereumAddress } from '@l2beat/shared-pure'

import {
  ContractValue,
  UpgradeabilityParameters,
} from '@l2beat/discovery-types'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import {
  ContractFieldSeverity,
  DiscoveryContractField,
  Permission,
  StackCategory,
  StackRole,
  ValueType,
} from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { AnalyzedContract } from './AddressAnalyzer'

type AddressToMetaMap = { [address: string]: ContractMeta }

// using `| undefined` for strong type safety,
// making sure ever field of meta is always processed.
export interface ContractMeta {
  descriptions: string[] | undefined
  roles: Set<StackRole> | undefined
  permissions: { [permission: string]: Set<EthereumAddress> } | undefined
  categories: Set<StackCategory> | undefined
  types: Set<ValueType> | undefined
  severity: ContractFieldSeverity | undefined
}

export function mergeContractMeta(
  a?: ContractMeta,
  b?: ContractMeta,
): ContractMeta | undefined {
  const result: ContractMeta = {
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

export function getSelfMeta(
  overrides?: ContractOverrides,
): ContractMeta | undefined {
  if (overrides?.description === undefined) {
    return undefined
  }
  return {
    descriptions: [overrides.description],
    roles: undefined,
    permissions: undefined,
    categories: undefined,
    severity: undefined,
    types: undefined,
  }
}

export function getTargetsMeta(
  self: EthereumAddress,
  upgradeability: UpgradeabilityParameters,
  handlerResults: HandlerResult[],
  fields: { [address: string]: DiscoveryContractField },
): AddressToMetaMap | undefined {
  const result = getMetaFromUpgradeability(self, upgradeability)

  for (const handlerResult of handlerResults) {
    const field = fields?.[handlerResult.field]
    const target = field?.target
    if (target) {
      for (const address of getAddresses(handlerResult.value)) {
        const meta = mergeContractMeta(
          result[address.toString()],
          targetConfigToMeta(self, field, target),
        )
        if (meta) {
          result[address.toString()] = meta
        }
      }
    }
  }

  return isEmptyObject(result) ? undefined : result
}

function getMetaFromUpgradeability(
  self: EthereumAddress,
  upgradeability: UpgradeabilityParameters,
): AddressToMetaMap {
  const result: Record<string, ContractMeta> = {}
  // @ts-expect-error pulling 'admin' from any type of proxy
  const upgradeabilityAdmin = upgradeability['admin'] as
    | EthereumAddress
    | undefined
  if (upgradeabilityAdmin !== undefined) {
    const permission: Permission = 'admin'
    result[upgradeabilityAdmin.toString()] = {
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
  return result
}

export function targetConfigToMeta(
  self: EthereumAddress,
  field: DiscoveryContractField,
  target: DiscoveryContractField['target'],
): ContractMeta | undefined {
  if (target === undefined) {
    return undefined
  }
  const result: ContractMeta = {
    descriptions: target.description ? [target.description] : undefined,
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

export function toSet<T>(
  value: T | T[] | null | undefined,
): Set<T> | undefined {
  if (value === undefined || value === null) {
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
