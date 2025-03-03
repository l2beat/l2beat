import type { Permission } from '@l2beat/discovery'
import { formatSeconds } from '@l2beat/shared-pure'

export const UltimatePermissionToPrefix: {
  [key in Permission]: string | undefined
} = {
  interact: 'Is allowed to interact with',
  upgrade: 'Can upgrade the implementation of',
  act: 'Can be used to act on behalf of',
  guard: 'A Guardian',
  challenge: 'A Challenger',
  propose: 'A Proposer',
  sequence: 'A Sequencer',
  validate: 'A Validator',
  operateLinea: 'An Operator',
  fastconfirm: 'A FastConfirmer',
  validateZkStack: 'A Validator',
  relay: 'A Relayer',
  validateBridge: 'A Validator',
  validateBridge2: 'A Validator',
  aggregatePolygon: 'A trusted Aggregator',
  operateStarknet: 'An Operator',
  governStarknet: 'A Governor',
  member: 'Is a member of',
}

export const DirectPermissionToPrefix: {
  [key in Permission]: string | undefined
} = {
  interact: 'Can be used to interact with',
  upgrade: 'Can be used to upgrade implementation of',
  act: 'Can act on behalf of',
  guard: 'Can act as a Guardian',
  challenge: 'Can act as a Challenger',
  propose: 'Can act as a Proposer',
  sequence: 'Can act as a Sequencer',
  validate: 'Can act as a Validator',
  operateLinea: 'Can act as an Operator',
  fastconfirm: 'Can act as a FastConfirmer',
  validateZkStack: 'Can act as a Validator',
  relay: 'Can act as a Relayer',
  validateBridge: 'Can act as a Validator',
  validateBridge2: 'Can act as a Validator',
  aggregatePolygon: 'Can act as a trusted Aggregator',
  operateStarknet: 'Can act as an Operator',
  governStarknet: 'Can act as a Governor',
  member: 'Is a member of',
}

export const PermissionsRequiringTarget: Permission[] = [
  'interact',
  'upgrade',
  'act',
]

export interface GroupedTransitivePermissionFact {
  atom: 'transitivePermission'
  params: [
    string,
    string,
    string[],
    number,
    string | undefined,
    number,
    TransitivePermissionVia[],
    'isFinal' | 'nonFinal',
  ]
}

interface TransitivePermissionVia {
  atom: 'tuple'
  params: [string, string, number]
}

function renderTransitivePermissionVia(via: TransitivePermissionVia): string {
  const delay = Number(via.params[2])
  if (delay === 0) {
    return `@@${via.params[0]}`
  }
  return `@@${via.params[0]} ${formatPermissionDelay(delay)}`
}

export function renderGroupedTransitivePermissionFact(
  fact: GroupedTransitivePermissionFact,
): string {
  const result: string[] = []
  const permission = fact.params[1] as Permission
  const delay = Number(fact.params[3])
  const description = fact.params[4]
  const _totalDelay = fact.params[5]
  const viaList = fact.params[6]
  const isFinal = fact.params[7]

  const permissionToPrefixMapping =
    isFinal === 'isFinal'
      ? UltimatePermissionToPrefix
      : DirectPermissionToPrefix

  result.push(
    permissionToPrefixMapping[permission] ??
      `has permission ${permission} from`,
  )
  if (PermissionsRequiringTarget.includes(permission)) {
    result.push(fact.params[2].map((x) => `@@${x}`).join(', '))
  }
  if (delay > 0) {
    result.push(formatPermissionDelay(delay))
  }
  if (description) {
    result.push('- ' + trimTrailingDots(description))
  }
  if (viaList !== null && viaList.length > 0) {
    const reversedViaList = [...viaList].reverse()
    result.push(
      `- acting via ${reversedViaList.map(renderTransitivePermissionVia).join(', ')}`,
    )
  }
  return result.join(' ') + '.'
}

export function formatPermissionDelay(delay: number): string {
  return `with ${formatSeconds(delay)} delay`
}

export function trimTrailingDots(s: string): string {
  return s.replace(/\.*$/, '')
}
