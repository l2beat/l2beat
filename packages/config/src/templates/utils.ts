import type { EntryParameters } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { unionBy } from 'lodash'
import { get$Implementations } from '../discovery/extractors'
import type {
  Badge,
  ProjectContracts,
  ProjectPermissions,
  ReferenceLink,
} from '../types'

export function mergeBadges(
  inherentBadges: Badge[],
  definedBadges: Badge[],
): Badge[] {
  const all = definedBadges.concat(inherentBadges)
  const allowDuplicates = all.filter(
    (b) => b.type === 'Other' || b.type === 'VM',
  ) // do not dedup badges of type 'Other' and 'VM' (multiVM)
  const rest = all.filter((b) => b.type !== 'Other' && b.type !== 'VM')
  return unionBy<Badge>(rest, (b) => b.type).concat(allowDuplicates)
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
  return implementation
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
