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
  const count = event.changes.length
  if (count === 1) {
    const c = event.changes[0]!
    const field = humanizeFieldName(c.field)
    const before = formatValue(c.before)
    const after = formatValue(c.after)
    if (options.omitName) {
      return `${field} changed from ${before} to ${after}.`
    }
    const contract = event.contractName ?? shortenAddress(event.address)
    return `${contract}: ${field} changed from ${before} to ${after}.`
  }
  const summary = summarizeFieldList(event.changes)
  if (options.omitName) {
    return `${count} fields changed (${summary}).`
  }
  const contract = event.contractName ?? shortenAddress(event.address)
  return `${contract}: ${count} fields changed (${summary}).`
}

function describeRoleUpdate(
  event: Extract<ActivityEvent, { type: 'role-update' }>,
  options: DescribeOptions,
): string {
  const count = event.changes.length
  if (count === 1) {
    const c = event.changes[0]!
    const before = formatValue(c.before)
    const after = formatValue(c.after)
    // Append the specific sub-field (e.g. "members", "adminRole", "3" for an
    // indexed Safe owner slot) so the description disambiguates which part of
    // the role changed — otherwise "ADMIN changed from X to Y" is identical
    // whether members[] or adminRole was touched.
    const sub = roleSubField(c.field, event.roleName)
    const label = sub ? `${event.roleName} ${sub}` : event.roleName
    if (options.omitName) {
      return `${label} changed from ${before} to ${after}.`
    }
    const contract = event.contractName ?? shortenAddress(event.address)
    return `${contract}: ${label} changed from ${before} to ${after}.`
  }
  const summary = summarizeFieldList(event.changes)
  if (options.omitName) {
    return `${event.roleName}: ${count} fields changed (${summary}).`
  }
  const contract = event.contractName ?? shortenAddress(event.address)
  return `${contract}: ${event.roleName} — ${count} fields changed (${summary}).`
}

/**
 * Build a short "field-a, field-b, field-c and N more" summary of changed
 * field keys, used in the table description for grouped events.
 */
function summarizeFieldList(
  changes: { field: string }[],
  preview = 3,
): string {
  const names = changes.slice(0, preview).map((c) => humanizeFieldName(c.field))
  const more = changes.length - preview
  return more > 0 ? `${names.join(', ')} and ${more} more` : names.join(', ')
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

/**
 * Extracts the sub-field of a role-update diff key so descriptions can say
 * "ADMIN members" or "Safe.owners slot 3" instead of just "ADMIN".
 * Returns `undefined` when the key doesn't carry a meaningful sub-field.
 */
function roleSubField(
  fieldKey: string,
  roleName: string,
): string | undefined {
  // accessControl.<ROLE>.(members|adminRole) — possibly prefixed with values.
  const ac = fieldKey.match(
    /^(?:values\.)?accessControl\.([^.]+)\.(members|adminRole)$/,
  )
  if (ac) return ac[2]

  // Safe owner indexed slot: values.$members.3 / $members.3
  const idx = fieldKey.match(/^(?:values\.)?\$members\.(\d+)$/)
  if (idx) return `slot ${idx[1]}`

  // Whole-array Safe members / Safe threshold / owner / pendingOwner — the
  // roleName itself already describes the change, nothing to append.
  if (roleName === 'Safe.owners' || roleName === 'Safe.threshold') return
  return
}

export function humanizeFieldName(key: string): string {
  // Strip known prefixes, then return the last segment as-is.
  const stripped = key.replace(/^values\./, '').replace(/^\$/, '')
  return stripped
}

export function formatValue(value: unknown): string {
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
