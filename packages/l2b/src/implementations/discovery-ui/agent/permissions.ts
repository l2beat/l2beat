import type { EntryParameters, ReceivedPermission } from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'

// Per section, so a long list of ultimate holders never hides the direct
// grants.
const GRANTS_SHOWN_MAX = 40

// Who can act on a contract, from the permission model's grants. The model
// stores them on each holder, so answering for a target means looking at
// every entry.
export function describePermissions(
  entries: readonly EntryParameters[],
  target: ChainSpecificAddress,
): string[] {
  // A holder in both the project and a shared module it references has the
  // same grants attached to each copy.
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  const holders = [...byAddress.values()]
  const name = (address: ChainSpecificAddress) =>
    describeHolder(byAddress.get(address), address)
  const ultimate = grantsOn(holders, target, 'receivedPermissions')
  const direct = grantsOn(holders, target, 'directlyReceivedPermissions')
  if (ultimate.length === 0 && direct.length === 0) {
    return [`No permissions are modelled on ${name(target)}.`]
  }
  const lines = [`Permissions on ${name(target)}:`]
  if (ultimate.length > 0) {
    lines.push('', 'Ultimately held by (holder first, through each via):')
    pushGrants(lines, name, ultimate, 'receivedPermissions')
  }
  if (direct.length > 0) {
    lines.push('', 'Granted directly to:')
    pushGrants(lines, name, direct, 'directlyReceivedPermissions')
  }
  lines.push(
    '',
    'To point at a route, show its contracts: the holder, each via, then the target.',
  )
  return lines
}

function pushGrants(
  lines: string[],
  name: (address: ChainSpecificAddress) => string,
  grants: { holder: ChainSpecificAddress; grant: ReceivedPermission }[],
  field: string,
) {
  for (const { holder, grant } of grants.slice(0, GRANTS_SHOWN_MAX)) {
    lines.push(`  ${describeGrant(name, holder, grant)}`)
  }
  const more = grants.length - GRANTS_SHOWN_MAX
  if (more > 0) {
    lines.push(
      `  and ${more} more: read ${field} in the project's discovered.json`,
    )
  }
}

function grantsOn(
  entries: readonly EntryParameters[],
  target: ChainSpecificAddress,
  field: 'receivedPermissions' | 'directlyReceivedPermissions',
): { holder: ChainSpecificAddress; grant: ReceivedPermission }[] {
  const grants: { holder: ChainSpecificAddress; grant: ReceivedPermission }[] =
    []
  for (const entry of entries) {
    for (const grant of entry[field] ?? []) {
      if (grant.from === target) {
        grants.push({ holder: entry.address, grant })
      }
    }
  }
  return grants
}

function describeGrant(
  name: (address: ChainSpecificAddress) => string,
  holder: ChainSpecificAddress,
  grant: ReceivedPermission,
): string {
  const parts = [`${grant.permission}: ${name(holder)}`]
  if (grant.via !== undefined && grant.via.length > 0) {
    // The model lists via from the target's side; a route reads from the
    // holder's.
    const hops = [...grant.via].reverse().map((hop) => {
      const delay = hop.delay ? ` +${formatDelay(hop.delay)}` : ''
      const condition = hop.condition ? ` if ${hop.condition}` : ''
      return `${name(hop.address)}${delay}${condition}`
    })
    parts.push(`via ${hops.join(' -> ')}`)
  }
  if (grant.delay) {
    parts.push(`delay ${formatDelay(grant.delay)}`)
  }
  if (grant.role !== undefined) {
    parts.push(`role ${grant.role}`)
  }
  if (grant.condition !== undefined) {
    parts.push(`if ${grant.condition}`)
  }
  const line = parts.join(', ')
  return grant.description === undefined
    ? line
    : `${line}. ${grant.description}`
}

function describeHolder(
  entry: EntryParameters | undefined,
  address: ChainSpecificAddress,
): string {
  // A permission given to the zero address was renounced.
  if (ChainSpecificAddress.address(address) === EthereumAddress.ZERO) {
    return `${address} (zero address, nobody can use it)`
  }
  if (entry === undefined) {
    return address
  }
  const label = entry.name ?? 'unnamed'
  if (entry.type === 'EOA') {
    return `${address} (${label}, EOA)`
  }
  const threshold = entry.values?.$threshold
  const members = entry.values?.$members
  if (typeof threshold === 'number' && Array.isArray(members)) {
    return `${address} (${label}, ${threshold}/${members.length} multisig)`
  }
  return `${address} (${label})`
}

export function formatDelay(seconds: number): string {
  const units: [string, number][] = [
    ['d', 86_400],
    ['h', 3_600],
    ['m', 60],
    ['s', 1],
  ]
  const parts: string[] = []
  let left = seconds
  for (const [unit, size] of units) {
    const count = Math.floor(left / size)
    if (count > 0) {
      parts.push(`${count}${unit}`)
      left -= count * size
    }
  }
  return parts.join(' ') || '0s'
}
