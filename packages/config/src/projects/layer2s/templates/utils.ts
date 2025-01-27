import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/discovery-types/dist/EthereumAddress'
import { unionBy } from 'lodash'
import type {
  ScalingProjectReference,
  ScalingProjectRiskViewEntry,
} from '../../../common'
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
    text: string
  }[],
): ScalingProjectReference[] {
  if (explorerUrl === undefined) {
    return []
  }

  return entries.map((e) => ({
    href: `${explorerUrl}/address/${e.address.toString()}#code`,
    text: e.text,
  }))
}

export function explorerContractSourceReference(
  explorerUrl: string | undefined,
  contract: ContractParameters,
): ScalingProjectRiskViewEntry['sources'] {
  if (explorerUrl === undefined) {
    return []
  }

  return [
    {
      contract: contract.name,
      references: [`${explorerUrl}/address/${safeGetImplementation(contract)}`],
    },
  ]
}
