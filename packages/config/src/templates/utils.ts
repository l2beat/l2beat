import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import unionBy from 'lodash/unionBy'
import { get$Implementations } from '../discovery/extractors'
import type {
  Badge,
  ProjectContracts,
  ProjectPermissions,
  ReferenceLink,
} from '../types'

export function mergeBadges(inherentBadges: Badge[], definedBadges: Badge[]) {
  const allBadges = definedBadges.concat(inherentBadges)
  const typeDuplicatesAllowed = ['Other', 'VM', 'DA']

  // by type
  const duplicateBadges: Badge[] = []
  const toBeUniqueBadges: Badge[] = []

  for (const badge of allBadges) {
    if (typeDuplicatesAllowed.includes(badge.type)) {
      duplicateBadges.push(badge)
    } else {
      toBeUniqueBadges.push(badge)
    }
  }

  return unionBy(toBeUniqueBadges, (badge) => badge.type).concat(
    duplicateBadges,
  )
}

export function mergePermissions(
  base: Record<string, ProjectPermissions>,
  pushed: Record<string, ProjectPermissions>,
): Record<string, ProjectPermissions> {
  const result: Record<string, ProjectPermissions> = structuredClone(base)

  for (const [key, value] of Object.entries(pushed)) {
    result[key] ??= {}
    if (value.roles !== undefined) {
      result[key].roles = (result[key].roles ?? []).concat(value.roles)
    }

    if (value.actors !== undefined) {
      result[key].actors = (result[key].actors ?? []).concat(value.actors)
    }
  }

  return result
}

export function mergeContracts(
  base: ProjectContracts['addresses'],
  pushed: ProjectContracts['addresses'],
): ProjectContracts['addresses'] {
  const result: ProjectContracts['addresses'] = structuredClone(base)

  for (const [key, value] of Object.entries(pushed)) {
    result[key] ??= []
    result[key] = unionBy(value, result[key] ?? [], 'address')
  }

  return result
}

export function safeGetImplementation(entry: EntryParameters): EthereumAddress {
  const implementation = get$Implementations(entry.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${entry.name}`)
  }
  return ChainSpecificAddress.address(implementation)
}

export function explorerReferences(
  explorerUrl: string | undefined,
  entries: {
    address: EthereumAddress
    title: string
  }[],
): ReferenceLink[] {
  if (explorerUrl === undefined) {
    return []
  }

  return entries.map((e) => ({
    title: e.title,
    url: `${explorerUrl}/address/${e.address.toString()}#code`,
  }))
}

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

export function emptyArrayToUndefined<T>(arr: T[]): T[] | undefined {
  return arr.length === 0 ? undefined : arr
}
