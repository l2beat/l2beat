import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/discovery-types/dist/EthereumAddress'
import { unionBy } from 'lodash'
import type {
  ProjectContracts,
  ProjectPermissions,
  ReferenceLink,
} from '../../../types'
import { type BadgeId, badges } from '../../badges'

export function mergeBadges(
  inherentBadges: BadgeId[],
  definedBadges: BadgeId[],
): BadgeId[] {
  const all = definedBadges.concat(inherentBadges)
  const allowDuplicates = all.filter(
    (b) => badges[b].type === 'Other' || badges[b].type === 'VM',
  ) // do not dedup badges of type 'Other' and 'VM' (multiVM)
  const rest = all.filter(
    (b) => badges[b].type !== 'Other' && badges[b].type !== 'VM',
  )
  return unionBy(rest, (b) => badges[b].type).concat(allowDuplicates)
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

export function safeGetImplementation(
  contract: ContractParameters,
): EthereumAddress {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
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
