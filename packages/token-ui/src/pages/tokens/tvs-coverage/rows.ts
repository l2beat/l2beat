import type { RouterInputs, RouterOutputs } from '@l2beat/token-backend'

export type Snapshot = NonNullable<
  RouterOutputs['tvsCoverage']['get']['snapshot']
>
export type SnapshotRow = Snapshot['rows'][number]
export type Dismissal = RouterOutputs['tvsCoverage']['dismissals'][number]
export type Row = SnapshotRow & { dismissal: Dismissal | undefined }
export type RowValue = NonNullable<Row['value']>
export type Status = Row['status']
export type Bridge = Row['bridges'][number]
export type DismissalReason = RouterInputs['tvsCoverage']['dismiss']['reason']

export type StatusFilter =
  | 'missing'
  | 'review'
  | 'unpriced'
  | 'counted'
  | 'scheduled'
  | 'dismissed'
  | 'all'
export type SideFilter = 'all' | 'chain' | 'escrow'

export interface Option<T extends string> {
  value: T
  label: string
  description?: string
}

export const STATUS_FILTERS: Option<StatusFilter>[] = [
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
      'Missing or review rows without a price, so they have no value.',
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
    value: 'dismissed',
    label: 'Dismissed',
    description: 'Marked by research as not worth counting.',
  },
  {
    value: 'all',
    label: 'All',
    description: 'Every row, including counted and dismissed ones.',
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

export function rowId(
  row: Pick<Row, 'projectId' | 'chain' | 'address'>,
): string {
  return `${row.projectId}:${row.chain}:${row.address}`
}

// A dismissed gap that the project starts counting is no longer a gap, so it
// leaves the dismissed list. The dismissal shows again if counting stops.
export function attachDismissals(
  rows: SnapshotRow[],
  dismissals: Dismissal[],
): Row[] {
  const byRow = new Map(
    dismissals.map((dismissal) => [rowId(dismissal), dismissal]),
  )
  return rows.map((row) => ({
    ...row,
    dismissal:
      row.status === 'counted' || row.status === 'countedViaCounterpart'
        ? undefined
        : byRow.get(rowId(row)),
  }))
}

// A chain row paired with an escrow row is the same gap seen from the other
// side, so the pair counts once, at its larger value.
export function sumValue(rows: Row[]): number {
  const values = new Map(
    rows.map((row) => [rowId(row), row.value?.valueUsd ?? 0]),
  )
  let total = 0
  for (const row of rows) {
    const value = row.value?.valueUsd ?? 0
    const paired =
      row.pairedWith &&
      values.get(rowId({ projectId: row.projectId, ...row.pairedWith }))
    total += paired === undefined ? value : Math.max(0, value - paired)
  }
  return total
}

// `dataUntil` is the end of the interop data, which recency is measured from.
export function filterRows(
  rows: Row[],
  filters: Filters,
  names: Names,
  dataUntil: number,
): Row[] {
  const needle = filters.search.trim().toLowerCase()
  return rows.filter(
    (row) =>
      (filters.showIgnored || !row.ignored) &&
      matchesStatus(row, filters.status) &&
      (filters.project === 'all' || row.projectId === filters.project) &&
      (filters.side === 'all' || row.side === filters.side) &&
      (filters.seenWithinDays === undefined ||
        row.lastSeen > dataUntil - filters.seenWithinDays * DAY) &&
      (row.value?.valueUsd ?? 0) >= filters.minValueUsd &&
      (!needle || searchText(row, names).includes(needle)),
  )
}

function matchesStatus(row: Row, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'dismissed') return row.dismissal !== undefined
  if (row.dismissal) return false
  switch (filter) {
    case 'missing':
      return row.status === 'missing'
    case 'review':
      return row.status === 'sameAssetOnly'
    case 'unpriced':
      return (
        (row.status === 'missing' || row.status === 'sameAssetOnly') &&
        row.value?.priceUsd === undefined
      )
    case 'counted':
      return row.status === 'counted' || row.status === 'countedViaCounterpart'
    case 'scheduled':
      return row.status === 'scheduled'
  }
}

function searchText(row: Row, names: Names): string {
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
}

// Rows without a value for the key go last in both directions.
export function sortRows(rows: Row[], sort: Sort, names: Names): Row[] {
  const sign = sort.direction === 'asc' ? 1 : -1
  return rows
    .map((row) => ({
      row,
      key: sortValue(row, sort.key, names),
      rank: sortRank(row, sort.key),
    }))
    .sort((a, b) => {
      if (a.key === undefined || b.key === undefined) {
        return Number(a.key === undefined) - Number(b.key === undefined)
      }
      return a.rank - b.rank || sign * compare(a.key, b.key)
    })
    .map(({ row }) => row)
}

// A value from a total supply that CoinGecko cannot cap may be mostly a
// premint, so it goes after values that are not.
function sortRank(row: Row, key: SortKey): number {
  return key === 'value' && row.value?.circulatingSupplyUnknown ? 1 : 0
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
      return row.dismissal ? 'Dismissed' : formatStatus(row.status)
    case 'bridges':
      return row.bridges.map((bridge) => names.bridge(bridge.id)).join(', ')
    case 'lastSeen':
      return row.lastSeen
  }
}

function compare(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

export function defaultDirection(key: SortKey): Sort['direction'] {
  switch (key) {
    case 'project':
    case 'token':
    case 'status':
    case 'bridges':
      return 'asc'
    case 'value':
    case 'volume':
    case 'lastSeen':
      return 'desc'
  }
}

export function formatStatus(status: Status): string {
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
        ? `Backed by ${row.countedVia.address} on ${formatChain(row.countedVia.chain)}, which the project counts.`
        : undefined
    case 'scheduled':
      return 'The project has a formula for this token that starts in the future.'
    case 'sameAssetOnly':
      return 'The project counts another deployment of this asset, but not this one.'
    default:
      return undefined
  }
}

export const DISMISSAL_REASON_LABELS: Record<DismissalReason, string> = {
  notRelevant: 'Not relevant',
  spam: 'Spam',
  doubleCounted: 'Double counted',
  other: 'Other',
}

export function formatRole(role: NonNullable<Row['role']>): string {
  switch (role) {
    case 'locked':
      return 'locked'
    case 'minted':
      return 'minted'
    case 'burnAndMint':
      return 'burn/mint'
    case 'both':
      return 'locked and minted'
    case 'unknown':
      return 'unknown'
  }
}

export function describeRole(
  role: NonNullable<Row['role']>,
): string | undefined {
  switch (role) {
    case 'locked':
      return 'A lock-and-mint bridge locks this token here and mints copies of it on other chains.'
    case 'minted':
      return 'A bridge minted this token here as a copy of one locked on another chain.'
    case 'burnAndMint':
      return 'A bridge moves this token by burning it on one chain and minting it on another.'
    case 'both':
      return 'Some bridges lock this token here to mint copies elsewhere, and others minted it here from a token locked elsewhere.'
    case 'unknown':
      return undefined
  }
}

export function formatBridgeType(bridgeType: Bridge['bridgeType']): string {
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

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatAge(timestamp: number, now: number): string {
  const seconds = Math.max(0, now - timestamp)
  if (seconds < 60 * 60) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < DAY) return `${Math.floor(seconds / (60 * 60))} h ago`
  return `${Math.floor(seconds / DAY)} d ago`
}

// A daily snapshot at `timestamp` covers the UTC day before it.
export function formatSnapshotDay(timestamp: number): string {
  return new Date((timestamp - DAY) * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
}

export function formatChain(chain: string): string {
  return chain.charAt(0).toUpperCase() + chain.slice(1)
}

export function shortAddress(address: string): string {
  if (address.length <= 16) return address
  return `${address.slice(0, 8)}…${address.slice(-5)}`
}
