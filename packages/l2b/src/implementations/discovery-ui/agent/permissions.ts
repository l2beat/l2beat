import type { EntryParameters, ReceivedPermission } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

const LINES_MAX = 60

// Who can act on a contract, from the permission model's grants. The model
// stores them on each holder, so answering for a target means looking at
// every entry.
export function describePermissions(
  entries: readonly EntryParameters[],
  target: ChainSpecificAddress,
): string[] {
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  const name = (address: ChainSpecificAddress) =>
    describeHolder(byAddress.get(address), address)
  const ultimate = grantsOn(entries, target, 'receivedPermissions')
  const direct = grantsOn(entries, target, 'directlyReceivedPermissions')
  if (ultimate.length === 0 && direct.length === 0) {
    return [`No permissions are modelled on ${name(target)}.`]
  }
  const lines = [`Permissions on ${name(target)}:`]
  if (ultimate.length > 0) {
    lines.push('', 'Ultimately held by (holder first, through each via):')
    for (const { holder, grant } of ultimate) {
      lines.push(`  ${describeGrant(name, holder, grant)}`)
    }
  }
  if (direct.length > 0) {
    lines.push('', 'Granted directly to:')
    for (const { holder, grant } of direct) {
      lines.push(`  ${describeGrant(name, holder, grant)}`)
    }
  }
  if (lines.length > LINES_MAX) {
    const more = lines.length - LINES_MAX
    lines.splice(LINES_MAX, more, `  and ${more} more lines`)
  }
  lines.push(
    '',
    'To point at a route, show its contracts: the holder, each via, then the target.',
  )
  return lines
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
