import type { RouterOutputs } from '@l2beat/token-backend'

export type Snapshot = RouterOutputs['tvsCoverage']['get']
export type Row = Snapshot['rows'][number]
export type Status = Row['status']
export type Bridge = Row['bridges'][number]

export type StatusFilter =
  | 'missing'
  | 'review'
  | 'unpriced'
  | 'counted'
  | 'scheduled'
  | 'all'
export type SideFilter = 'all' | 'chain' | 'escrow'

export const STATUS_FILTERS: {
  value: StatusFilter
  label: string
  description: string
}[] = [
  {
    value: 'missing',
    label: 'Missing',
    description:
      'The project counts neither this token nor any other deployment of its asset.',
  },
  {
    value: 'review',
    label: 'Needs review',
    description:
      'The project counts another deployment of the same asset, but not this one.',
  },
  {
    value: 'unpriced',
    label: 'Needs pricing',
    description:
      'Missing or review rows without a CoinGecko price, so they have no value.',
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Counted by a formula that starts in the future.',
  },
  {
    value: 'counted',
    label: 'Counted',
    description:
      "Counted directly, or through its locked counterpart in the project's escrow.",
  },
  {
    value: 'all',
    label: 'All',
    description: 'Every row, including counted ones.',
  },
]

export interface Filters {
  status: StatusFilter
  project: string
  side: SideFilter
  seenWithinDays: number | undefined
  minValueUsd: number
  search: string
  showIgnored: boolean
}

export interface Names {
  project: (id: string) => string
  bridge: (id: string) => string
}

export type SortKey =
  | 'project'
  | 'token'
  | 'value'
  | 'volume'
  | 'status'
  | 'bridges'
  | 'lastSeen'

export interface Sort {
  key: SortKey
  direction: 'asc' | 'desc'
}

const DAY = 24 * 60 * 60

export function filterRows(
  rows: Row[],
  filters: Filters,
  names: Names,
  now: number,
): Row[] {
  const needle = filters.search.trim().toLowerCase()
  return rows.filter((row) => {
    if (!filters.showIgnored && row.ignored) return false
    if (!matchesStatus(row, filters.status)) return false
    if (filters.project !== 'all' && row.projectId !== filters.project) {
      return false
    }
    if (filters.side !== 'all' && row.side !== filters.side) return false
    if (
      filters.seenWithinDays !== undefined &&
      row.lastSeen < now - filters.seenWithinDays * DAY
    ) {
      return false
    }
    if (
      filters.minValueUsd > 0 &&
      (row.value?.valueUsd ?? 0) < filters.minValueUsd
    ) {
      return false
    }
    if (!needle) return true
    return [
      row.projectId,
      names.project(row.projectId),
      row.chain,
      row.address,
      row.symbol,
      row.abstractSymbol,
      row.issuer,
      ...row.bridges.map((bridge) => names.bridge(bridge.id)),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  })
}

function matchesStatus(row: Row, filter: StatusFilter) {
  switch (filter) {
    case 'missing':
      return row.status === 'missing'
    case 'review':
      return row.status === 'sameAssetOnly'
    case 'unpriced':
      return (
        (row.status === 'missing' || row.status === 'sameAssetOnly') &&
        row.pricing === undefined
      )
    case 'counted':
      return row.status === 'counted' || row.status === 'countedViaCounterpart'
    case 'scheduled':
      return row.status === 'scheduled'
    case 'all':
      return true
  }
}

export function sortRows(rows: Row[], sort: Sort, names: Names): Row[] {
  return rows
    .map((row, index) => ({
      row,
      index,
      value: sortValue(row, sort.key, names),
    }))
    .sort((a, b) => {
      if (a.value === undefined && b.value === undefined) {
        return a.index - b.index
      }
      if (a.value === undefined) return 1
      if (b.value === undefined) return -1
      const compared =
        typeof a.value === 'number' && typeof b.value === 'number'
          ? a.value - b.value
          : String(a.value).localeCompare(String(b.value), undefined, {
              numeric: true,
            })
      if (compared === 0) return a.index - b.index
      return sort.direction === 'asc' ? compared : -compared
    })
    .map(({ row }) => row)
}

function sortValue(
  row: Row,
  key: SortKey,
  names: Names,
): string | number | undefined {
  switch (key) {
    case 'project':
      return names.project(row.projectId)
    case 'token':
      return row.symbol ?? row.abstractSymbol
    case 'value':
      return row.value?.valueUsd
    case 'volume':
      return row.volumeUsd
    case 'status':
      return formatStatus(row.status)
    case 'bridges':
      return row.bridges.map((bridge) => names.bridge(bridge.id)).join(', ')
    case 'lastSeen':
      return row.lastSeen
  }
}

export function defaultDirection(key: SortKey): Sort['direction'] {
  return ['project', 'token', 'status', 'bridges'].includes(key)
    ? 'asc'
    : 'desc'
}

export function formatStatus(status: Status) {
  switch (status) {
    case 'counted':
      return 'Counted'
    case 'countedViaCounterpart':
      return 'Counted via'
    case 'scheduled':
      return 'Scheduled'
    case 'sameAssetOnly':
      return 'Review'
    case 'missing':
      return 'Missing'
  }
}

export function describeStatus(row: Row): string | undefined {
  switch (row.status) {
    case 'countedViaCounterpart':
      return row.countedVia
        ? `Backed by ${row.countedVia.address} on ${row.countedVia.chain}, which the project counts.`
        : undefined
    case 'scheduled':
      return 'The project has a formula for this token that starts in the future.'
    case 'sameAssetOnly':
      return 'The project counts another deployment of this asset, but not this one.'
    default:
      return undefined
  }
}

export function formatRole(role: NonNullable<Row['role']>) {
  switch (role) {
    case 'locked':
      return 'Locked'
    case 'minted':
      return 'Minted'
    case 'burnAndMint':
      return 'Burn/mint'
    case 'both':
      return 'Both'
    case 'unknown':
      return 'Unknown'
  }
}

export function formatBridgeType(bridgeType: Bridge['bridgeType']) {
  switch (bridgeType) {
    case 'lockAndMint':
      return 'lock/mint'
    case 'burnAndMint':
      return 'burn/mint'
    case 'nonMinting':
      return 'non-minting'
    default:
      return 'unknown'
  }
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatAge(timestamp: number, now: number) {
  const seconds = Math.max(0, now - timestamp)
  if (seconds < 60 * 60) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < DAY) return `${Math.floor(seconds / (60 * 60))} h ago`
  return `${Math.floor(seconds / DAY)} d ago`
}

export function formatChain(chain: string) {
  return chain.charAt(0).toUpperCase() + chain.slice(1)
}

export function shortAddress(address: string) {
  if (address.length <= 16) return address
  return `${address.slice(0, 8)}…${address.slice(-5)}`
}
