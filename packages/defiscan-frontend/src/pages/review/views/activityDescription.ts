import type { ActivityEvent } from '../../../types'

interface DescribeOptions {
  /** When true, the contract name is omitted — caller is rendering it separately as a title. */
  omitName?: boolean
}

export function describeActivityEvent(
  event: ActivityEvent,
  options: DescribeOptions = {},
): string {
  switch (event.type) {
    case 'upgrade':
      return describeUpgrade(event, options)
    case 'data-change':
      return describeDataChange(event, options)
    case 'role-update':
      return describeRoleUpdate(event, options)
    case 'contract-added':
      return describeContractAdded(event, options)
    case 'contract-removed':
      return describeContractRemoved(event, options)
  }
}

function describeUpgrade(
  event: Extract<ActivityEvent, { type: 'upgrade' }>,
  options: DescribeOptions,
): string {
  const implCount = event.implementations.length
  const implPhrase =
    implCount === 1
      ? 'a new implementation'
      : `${implCount} new implementations`

  if (options.omitName) {
    const tag = event.isDependency ? 'Dependency upgraded' : 'Upgraded'
    return `${tag} to ${implPhrase}.`
  }

  if (event.isDependency) {
    const owner = event.entity ? `${event.entity}'s ` : ''
    return `${owner}${event.contractName} (dependency) was upgraded to ${implPhrase}.`
  }
  return `${event.contractName} was upgraded to ${implPhrase}.`
}

function describeDataChange(
  event: Extract<ActivityEvent, { type: 'data-change' }>,
  options: DescribeOptions,
): string {
  const field = humanizeFieldName(event.field)
  const before = formatValue(event.before)
  const after = formatValue(event.after)
  if (options.omitName) {
    return `${field} changed from ${before} to ${after}.`
  }
  const contract = event.contractName ?? shortenAddress(event.address)
  return `${contract}: ${field} changed from ${before} to ${after}.`
}

function describeRoleUpdate(
  event: Extract<ActivityEvent, { type: 'role-update' }>,
  options: DescribeOptions,
): string {
  const before = formatValue(event.before)
  const after = formatValue(event.after)
  if (options.omitName) {
    return `${event.roleName} changed from ${before} to ${after}.`
  }
  const contract = event.contractName ?? shortenAddress(event.address)
  return `${contract}: ${event.roleName} changed from ${before} to ${after}.`
}

function describeContractAdded(
  event: Extract<ActivityEvent, { type: 'contract-added' }>,
  options: DescribeOptions,
): string {
  if (options.omitName) return 'New contract discovered.'
  const contract = event.contractName ?? shortenAddress(event.address)
  return `New contract discovered: ${contract}.`
}

function describeContractRemoved(
  event: Extract<ActivityEvent, { type: 'contract-removed' }>,
  options: DescribeOptions,
): string {
  if (options.omitName) return 'Contract removed from discovery.'
  const contract = event.contractName ?? shortenAddress(event.address)
  return `${contract} removed from discovery.`
}

function humanizeFieldName(key: string): string {
  // Strip known prefixes, then return the last segment as-is.
  const stripped = key.replace(/^values\./, '').replace(/^\$/, '')
  return stripped
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return '∅'
  if (typeof value === 'string') {
    const trimmed = value.startsWith('eth:')
      ? shortenAddress(value)
      : value.length > 40
        ? `${value.slice(0, 20)}…`
        : value
    return trimmed
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  try {
    const s = JSON.stringify(value)
    return s.length > 60 ? `${s.slice(0, 57)}…` : s
  } catch {
    return '[unserializable]'
  }
}

function shortenAddress(address: string): string {
  const raw = address.includes(':') ? address.split(':').pop()! : address
  if (raw.length <= 10) return raw
  return `${raw.slice(0, 6)}…${raw.slice(-4)}`
}
