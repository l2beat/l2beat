import { assert, type EthereumAddress } from '@l2beat/shared-pure'

import { groupBy } from 'lodash'
import type { ContractConfig } from '../config/ContractConfig'
import type {
  PermissionConfiguration,
  RawPermissionConfiguration,
  StructureContractField,
} from '../config/StructureConfig'
import { resolveReferenceFromValues } from '../handlers/reference'
import { valueToNumber } from '../handlers/utils/valueToNumber'
import type { ContractValue } from '../output/types'
import { get$Admins, toAddressArray } from '../utils/extractors'
import type { Analysis } from './AddressAnalyzer'

type AddressToMetaMap = { [address: string]: ContractMeta }

// using `| undefined` for strong type safety,
// making sure ever field of meta is always processed.
export interface ContractMeta {
  canActIndependently?: boolean
  permissions?: PermissionConfiguration[]
}

export function mergeContractMeta(
  a?: ContractMeta,
  b?: ContractMeta,
): ContractMeta | undefined {
  const result: ContractMeta = {
    permissions: mergePermissions(a?.permissions, b?.permissions),
    canActIndependently: mergeCanActIndependently(
      a?.canActIndependently,
      b?.canActIndependently,
    ),
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
    const key = `${v.type}-${v.target.toString()}-${v.condition ?? ''}`
    // 'interact' permission is special - what it does is in its description,
    // e.g. [interact "cancel tx"] and [interact "add tx"] shouldn't be grouped,
    // regardless of the delay.
    return v.type === 'interact' ? `${key}-${v.description ?? ''}` : key
  }

  const result: PermissionConfiguration[] = []
  const grouping = groupBy(a.concat(b), encodeKey)
  for (const key in grouping) {
    const allEntries = grouping[key] ?? []
    const shortestDelay = allEntries.reduce(
      (a, b) => Math.min(a, b.delay),
      Infinity,
    )
    const entries = allEntries.filter((e) => e.delay === shortestDelay)

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
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
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

export function getSelfMeta(config: ContractConfig): ContractMeta | undefined {
  const result = {
    canActIndependently: config.canActIndependently,
    permissions: undefined,
  }

  return isEmptyObject(result) ? undefined : result
}

export function getTargetsMeta(
  self: EthereumAddress,
  values: Record<string, ContractValue | undefined> = {},
  fields: { [address: string]: StructureContractField } = {},
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): AddressToMetaMap | undefined {
  const result: AddressToMetaMap = {}

  for (const [fieldName, value] of Object.entries(values)) {
    const field = fields[fieldName]
    const target = field?.permissions
    if (target) {
      for (const address of toAddressArray(value)) {
        const meta = mergeContractMeta(
          result[address.toString()],
          targetConfigToMeta(self, field, analysis),
        )
        if (meta) {
          result[address.toString()] = meta
        }
      }
    }
  }

  // NOTE(radomski): Only add an upgrade permission if it hasn't been
  // configured previously. This is necessary because if a template configures
  // the upgrade permission with a delay, we shouldn't override it with the
  // default zero-delay permission. We always search for the smallest delay, so
  // a zero delay would always take precedence.
  for (const upgradeabilityAdmin of get$Admins(values)) {
    const permissions =
      result[upgradeabilityAdmin.toString()]?.permissions ?? []

    if (!permissions.some((p) => p.type === 'upgrade')) {
      const meta = mergeContractMeta(result[upgradeabilityAdmin.toString()], {
        permissions: [{ type: 'upgrade', target: self, delay: 0 }],
      })

      if (meta) {
        result[upgradeabilityAdmin.toString()] = meta
      }
    }
  }

  return isEmptyObject(result) ? undefined : result
}

function targetConfigToMeta(
  self: EthereumAddress,
  field: StructureContractField,
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): ContractMeta | undefined {
  if (field.permissions === undefined) {
    return undefined
  }

  const result: ContractMeta = {
    permissions: field.permissions?.map((p) =>
      linkPermission(p, self, analysis.values, analysis),
    ),
  }
  return isEmptyObject(result) ? undefined : result
}

function linkPermission(
  rawPermission: RawPermissionConfiguration,
  self: EthereumAddress,
  values: Analysis['values'],
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
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
  targetsMeta: Analysis['targetsMeta'][],
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

function isEmptyObject(obj: object): boolean {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined || value === false)
  )
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
