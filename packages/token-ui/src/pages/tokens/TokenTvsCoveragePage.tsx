import { formatCurrency } from '@l2beat/shared-pure'
import type { RouterOutputs } from '@l2beat/token-backend'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  RotateCwIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { Input } from '~/components/core/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/Tooltip'
import { ExplorerLink } from '~/components/ExplorerLink'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'

type CoverageData = RouterOutputs['tvsCoverage']['get']
type CoverageRow = CoverageData['rows'][number]
type BridgeDetails = CoverageData['bridges'][number]
type ProjectDetails = CoverageData['projects'][number]
type SupplyEstimate = RouterOutputs['tvsCoverage']['getSupplyEstimates'][number]
type VaultAsset = NonNullable<SupplyEstimate['vaultAsset']>
type CoverageFilter = 'missing' | 'review' | 'counted' | 'scheduled' | 'all'
type WindowDays = 7 | 30 | 90
type SortDirection = 'asc' | 'desc'
type SortKey =
  | 'project'
  | 'token'
  | 'totalSupply'
  | 'estimatedValueUsd'
  | 'volumeUsd'
  | 'status'
  | 'role'
  | 'bridges'

interface SortState {
  key: SortKey
  direction: SortDirection
}

const PAGE_SIZE = 25
const MAX_SORTABLE_ROWS = 100
const MAX_VISIBLE_BRIDGES = 4
const SUPPLY_REQUEST_DEBOUNCE_MS = 300
const CASE_SENSITIVE_TOKEN_ADDRESS_CHAINS = new Set(['solana', 'tron'])

export function TokenTvsCoveragePage() {
  const trpc = useTRPC()
  const [days, setDays] = useState<WindowDays>(30)
  const [project, setProject] = useState('all')
  const [coverage, setCoverage] = useState<CoverageFilter>('missing')
  const [minimumVolume, setMinimumVolume] = useState('0')
  const [search, setSearch] = useState('')
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE)
  const [sort, setSort] = useState<SortState>({
    key: 'estimatedValueUsd',
    direction: 'desc',
  })
  const {
    data,
    error,
    isError,
    isFetching,
    isLoading,
    refetch: refetchCoverage,
  } = useQuery(
    trpc.tvsCoverage.get.queryOptions(
      { days },
      {
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    ),
  )

  const projectsById = useMemo(
    () =>
      new Map((data?.projects ?? []).map((project) => [project.id, project])),
    [data],
  )
  const projectsWithRows = useMemo(() => {
    const ids = new Set((data?.rows ?? []).map((row) => row.projectId))
    return (data?.projects ?? [])
      .filter((project) => ids.has(project.id))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data])
  const explorerUrls = useMemo(
    () =>
      new Map(
        (data?.chains ?? []).map((chain) => [chain.name, chain.explorerUrl]),
      ),
    [data],
  )
  const bridgesById = useMemo(
    () => new Map((data?.bridges ?? []).map((bridge) => [bridge.id, bridge])),
    [data],
  )
  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const threshold = Number(minimumVolume) || 0

    return (data?.rows ?? []).filter((row) => {
      if (project !== 'all' && row.projectId !== project) return false
      if (!matchesCoverage(row.status, coverage)) return false
      if (row.volumeUsd < threshold) return false
      if (!needle) return true

      return [
        row.projectId,
        projectsById.get(row.projectId)?.name,
        row.chain,
        row.address,
        row.symbol,
        row.abstractSymbol,
        row.issuer,
        row.role,
        ...row.bridges.map(
          (bridge) => bridgesById.get(bridge.id)?.name ?? bridge.id,
        ),
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [
    bridgesById,
    coverage,
    data,
    minimumVolume,
    project,
    projectsById,
    search,
  ])

  const rankedRows = useMemo(
    () => filteredRows.slice(0, MAX_SORTABLE_ROWS),
    [filteredRows],
  )
  const supplyRequests = useMemo(
    () =>
      rankedRows
        .filter((row) => row.side === 'chain')
        .map((row) => ({ chain: row.chain, address: row.address })),
    [rankedRows],
  )
  const [debouncedSupplyRequests, setDebouncedSupplyRequests] =
    useState(supplyRequests)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSupplyRequests(supplyRequests),
      SUPPLY_REQUEST_DEBOUNCE_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [supplyRequests])

  const supplyQuery = useQuery(
    trpc.tvsCoverage.getSupplyEstimates.queryOptions(debouncedSupplyRequests, {
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),
  )
  const supplyEstimates = supplyQuery.data ?? []
  const isFetchingSupplies = supplyQuery.isFetching
  const isLoadingSupplies =
    isFetchingSupplies ||
    debouncedSupplyRequests.length !== supplyRequests.length
  const supplyByDeployment = useMemo(
    () =>
      new Map(
        supplyEstimates?.map((estimate) => [
          deploymentKey(estimate.chain, estimate.address),
          estimate,
        ]),
      ),
    [supplyEstimates],
  )
  const sortedRows = useMemo(
    () =>
      sortRows(rankedRows, sort, supplyByDeployment, projectsById, bridgesById),
    [bridgesById, projectsById, rankedRows, sort, supplyByDeployment],
  )
  const shownRows = useMemo(
    () => sortedRows.slice(0, visibleRows),
    [sortedRows, visibleRows],
  )
  const sortBy = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : defaultSortDirection(key),
    }))
  }
  const volume = filteredRows.reduce((sum, row) => sum + row.volumeUsd, 0)
  const hasMoreRows = shownRows.length < rankedRows.length
  const nextBatchSize = Math.min(
    PAGE_SIZE,
    rankedRows.length - shownRows.length,
  )
  const summary = data
    ? `${filteredRows.length.toLocaleString()} rows · ${formatCurrency(
        volume,
        'usd',
      )}${
        filteredRows.length > rankedRows.length
          ? ` · top ${rankedRows.length.toLocaleString()} by volume`
          : ''
      }${hasMoreRows ? ` · ${shownRows.length.toLocaleString()} shown` : ''}`
    : undefined

  return (
    <AppLayout>
      <Card className="flex h-[calc(100vh-16px)] flex-col">
        <CardHeader className="gap-3 border-b">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <CardTitle>Interop → TVS gaps</CardTitle>
            {summary && <CardDescription>{summary}</CardDescription>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={String(days)}
              onValueChange={(value) => {
                setDays(Number(value) as WindowDays)
                setVisibleRows(PAGE_SIZE)
              }}
            >
              <SelectTrigger size="sm" className="w-28" aria-label="Window">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={project}
              onValueChange={(value) => {
                setProject(value)
                setVisibleRows(PAGE_SIZE)
              }}
            >
              <SelectTrigger size="sm" className="w-40" aria-label="Project">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projectsWithRows.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={coverage}
              onValueChange={(value) => {
                setCoverage(value as CoverageFilter)
                setVisibleRows(PAGE_SIZE)
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-36"
                aria-label="TVS coverage"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="review">Needs review</SelectItem>
                <SelectItem value="counted">Counted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              value={minimumVolume}
              onChange={(event) => {
                setMinimumVolume(event.target.value)
                setVisibleRows(PAGE_SIZE)
              }}
              className="h-8 w-28"
              placeholder="Min volume"
              aria-label="Minimum volume"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setVisibleRows(PAGE_SIZE)
              }}
              className="h-8 w-40 min-w-40 flex-1"
              placeholder="Search"
              aria-label="Search"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              disabled={isFetching || isLoadingSupplies}
              aria-label={
                isFetching || isLoadingSupplies ? 'Refreshing' : 'Refresh'
              }
              onClick={() => {
                void refetchCoverage()
                void supplyQuery.refetch()
              }}
            >
              <RotateCwIcon
                className={cn(
                  (isFetching || isLoadingSupplies) && 'animate-spin',
                )}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState className="h-full" />
          ) : isError ? (
            <div className="grid h-full place-items-center p-4 text-center text-destructive text-sm">
              {error.message}
            </div>
          ) : (
            <Table className="min-w-[980px] table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-12 text-right">#</TableHead>
                  <SortableTableHead
                    className="w-40"
                    label="Project"
                    sortKey="project"
                    sort={sort}
                    onSort={sortBy}
                  />
                  <SortableTableHead
                    className="w-44"
                    label="Token"
                    sortKey="token"
                    sort={sort}
                    onSort={sortBy}
                  />
                  <SortableTableHead
                    className="w-28"
                    label="totalSupply()"
                    sortKey="totalSupply"
                    sort={sort}
                    onSort={sortBy}
                    align="right"
                  />
                  <SortableTableHead
                    className="w-28"
                    label="Est. value"
                    sortKey="estimatedValueUsd"
                    sort={sort}
                    onSort={sortBy}
                    align="right"
                  />
                  <SortableTableHead
                    className="w-28"
                    label="Volume"
                    sortKey="volumeUsd"
                    sort={sort}
                    onSort={sortBy}
                    align="right"
                  />
                  <SortableTableHead
                    className="w-28"
                    label="TVS"
                    sortKey="status"
                    sort={sort}
                    onSort={sortBy}
                  />
                  <SortableTableHead
                    className="w-20"
                    label="Role"
                    sortKey="role"
                    sort={sort}
                    onSort={sortBy}
                  />
                  <SortableTableHead
                    className="w-24"
                    label="Via"
                    sortKey="bridges"
                    sort={sort}
                    onSort={sortBy}
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {shownRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No results
                    </TableCell>
                  </TableRow>
                ) : (
                  shownRows.map((row, index) => {
                    const projectInfo = projectsById.get(row.projectId)
                    const explorerUrl = explorerUrls.get(row.chain)
                    const symbol = row.abstractSymbol ?? row.symbol ?? 'Unknown'
                    const supply =
                      row.side === 'chain'
                        ? supplyByDeployment.get(
                            deploymentKey(row.chain, row.address),
                          )
                        : undefined

                    return (
                      <TableRow
                        key={`${row.projectId}:${row.chain}:${row.address}`}
                      >
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            {projectInfo?.iconUrl && (
                              <img
                                src={projectInfo.iconUrl}
                                alt=""
                                width={20}
                                height={20}
                                className="size-5 rounded-sm object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.visibility =
                                    'hidden'
                                }}
                              />
                            )}
                            {projectInfo?.name ?? row.projectId}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {row.side === 'escrow'
                              ? `escrow on ${row.chain}`
                              : row.chain}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={tokenIconUrl(row.iconUrl)}
                              alt=""
                              width={24}
                              height={24}
                              className="size-6 rounded-full bg-muted object-cover"
                              onError={(event) => {
                                if (
                                  !event.currentTarget.src.endsWith(
                                    '/images/token-placeholder.png',
                                  )
                                ) {
                                  event.currentTarget.src =
                                    '/images/token-placeholder.png'
                                } else {
                                  event.currentTarget.style.visibility =
                                    'hidden'
                                }
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="font-medium">{symbol}</span>
                                {row.ignored && (
                                  <span className="ml-1 font-normal text-muted-foreground text-xs">
                                    ignored
                                  </span>
                                )}
                                {supply?.vaultAsset && (
                                  <VaultAssetBadges asset={supply.vaultAsset} />
                                )}
                              </div>
                              <Address row={row} explorerUrl={explorerUrl} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <div className="flex flex-col items-end gap-1">
                            <span
                              title={
                                supply?.totalSupply === undefined
                                  ? undefined
                                  : `${supply.totalSupply} ${symbol}`
                              }
                            >
                              {supply?.totalSupply === undefined
                                ? isLoadingSupplies
                                  ? '…'
                                  : '—'
                                : formatTokenSupply(supply.totalSupply)}
                            </span>
                            <CoinGeckoCirculatingSupplyBadge
                              estimate={supply}
                              symbol={symbol}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {supply?.estimatedValueUsd === undefined
                            ? isLoadingSupplies
                              ? '…'
                              : '—'
                            : formatCurrency(supply.estimatedValueUsd, 'usd')}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <div className="font-medium">
                            {formatCurrency(row.volumeUsd, 'usd')}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {row.transferCount.toLocaleString()} txs
                          </div>
                        </TableCell>
                        <TableCell>
                          <CoverageBadge row={row} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatInteropRole(row.role)}
                        </TableCell>
                        <TableCell>
                          <BridgeIconStack
                            bridges={row.bridges.map((bridge) => ({
                              ...bridge,
                              name:
                                bridgesById.get(bridge.id)?.name ?? bridge.id,
                              iconUrl: bridgesById.get(bridge.id)?.iconUrl,
                            }))}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
                {shownRows.length > 0 && hasMoreRows && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={9} className="py-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoadingSupplies}
                        onClick={() =>
                          setVisibleRows((current) =>
                            Math.min(current + PAGE_SIZE, rankedRows.length),
                          )
                        }
                      >
                        {isLoadingSupplies
                          ? 'Loading…'
                          : `Load ${nextBatchSize} more`}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  )
}

function Address({
  row,
  explorerUrl,
}: {
  row: CoverageRow
  explorerUrl: string | undefined
}) {
  const value = shortAddress(row.address)
  const className = 'font-mono text-muted-foreground text-xs'

  if (explorerUrl && /^0x[0-9a-f]{40}$/i.test(row.address)) {
    return (
      <div className={className} title={row.address}>
        <ExplorerLink
          explorerUrl={explorerUrl}
          value={row.address}
          type="address"
        >
          {value}
        </ExplorerLink>
      </div>
    )
  }

  return (
    <div className={className} title={row.address}>
      {value}
    </div>
  )
}

const STATUS_STYLES: Record<CoverageRow['status'], string> = {
  counted:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  countedViaCounterpart:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  scheduled:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
  sameAssetOnly:
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
  missing:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
}

function CoverageBadge({ row }: { row: CoverageRow }) {
  const badge = (
    <Badge variant="outline" className={STATUS_STYLES[row.status]}>
      {formatStatus(row.status)}
    </Badge>
  )
  const description = describeStatus(row)
  if (!description) return badge

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" tabIndex={0}>
          {badge}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-72">{description}</TooltipContent>
    </Tooltip>
  )
}

function formatStatus(status: CoverageRow['status']) {
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

function describeStatus(row: CoverageRow) {
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

function matchesCoverage(
  status: CoverageRow['status'],
  filter: CoverageFilter,
) {
  switch (filter) {
    case 'missing':
      return status === 'missing'
    case 'review':
      return status === 'sameAssetOnly'
    case 'counted':
      return status === 'counted' || status === 'countedViaCounterpart'
    case 'scheduled':
      return status === 'scheduled'
    case 'all':
      return true
  }
}

function tokenIconUrl(iconUrl: string | undefined) {
  if (!iconUrl) return '/images/token-placeholder.png'
  return iconUrl.startsWith('/') ? `https://l2beat.com${iconUrl}` : iconUrl
}

function shortAddress(address: string) {
  if (address.length <= 16) return address
  return `${address.slice(0, 8)}…${address.slice(-5)}`
}

function deploymentKey(chain: string, address: string) {
  const normalized = CASE_SENSITIVE_TOKEN_ADDRESS_CHAINS.has(chain)
    ? address
    : address.toLowerCase()
  return `${chain}:${normalized}`
}

function VaultAssetBadges({ asset }: { asset: VaultAsset }) {
  const label = asset.symbol ?? shortAddress(asset.address)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex"
          tabIndex={0}
          aria-label={`Backed by: ${label}`}
        >
          <Badge
            variant="outline"
            className="h-5 max-w-32 px-1.5 font-normal text-[10px]"
          >
            Backed by: {label}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent className="space-y-0.5">
        <div>ERC-4626 asset(): {label}</div>
        <div className="font-mono opacity-75">{asset.address}</div>
      </TooltipContent>
    </Tooltip>
  )
}

function CoinGeckoCirculatingSupplyBadge({
  estimate,
  symbol,
}: {
  estimate: SupplyEstimate | undefined
  symbol: string
}) {
  const totalSupply = Number(estimate?.totalSupply)
  const circulatingSupply = estimate?.coingeckoCirculatingSupply
  if (
    circulatingSupply === undefined ||
    !Number.isFinite(circulatingSupply) ||
    circulatingSupply < 0 ||
    !Number.isFinite(totalSupply) ||
    totalSupply <= circulatingSupply
  ) {
    return null
  }

  const circulatingLabel = formatTokenSupply(String(circulatingSupply))
  const totalLabel = formatTokenSupply(String(totalSupply))
  const differenceLabel = formatTokenSupply(
    String(totalSupply - circulatingSupply),
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex"
          tabIndex={0}
          aria-label={`CoinGecko reports ${circulatingLabel} ${symbol} circulating globally, below this contract's total supply of ${totalLabel}`}
        >
          <Badge
            variant="outline"
            className="h-5 border-amber-300 bg-amber-50 px-1.5 font-normal text-[10px] text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
          >
            CG circ. {circulatingLabel}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent className="w-64 space-y-1 text-left text-xs">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 tabular-nums">
          <span className="opacity-75">totalSupply()</span>
          <span className="text-right">{totalLabel}</span>
          <span className="opacity-75">CG circulating</span>
          <span className="text-right">{circulatingLabel}</span>
          <span className="opacity-75">Difference</span>
          <span className="text-right">{differenceLabel}</span>
        </div>
        <div className="opacity-75">Global CoinGecko supply</div>
        {estimate?.coingeckoUpdatedAt && (
          <div className="opacity-75">
            Updated {formatCoinGeckoTimestamp(estimate.coingeckoUpdatedAt)}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function formatTokenSupply(supply: string) {
  const value = Number(supply)
  if (!Number.isFinite(value)) return supply

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCoinGeckoTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return timestamp
  return `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`
}

function SortableTableHead({
  label,
  sortKey,
  sort,
  onSort,
  align = 'left',
  className,
}: {
  label: string
  sortKey: SortKey
  sort: SortState
  onSort: (key: SortKey) => void
  align?: 'left' | 'right'
  className?: string
}) {
  const active = sort.key === sortKey
  const Icon = active
    ? sort.direction === 'asc'
      ? ArrowUpIcon
      : ArrowDownIcon
    : ArrowUpDownIcon

  return (
    <TableHead
      className={className}
      aria-sort={
        active
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1 py-2',
          align === 'right' && 'justify-end',
        )}
        aria-label={`Sort by ${label}`}
        onClick={() => onSort(sortKey)}
      >
        {label}
        <Icon
          aria-hidden="true"
          className={cn('size-3 shrink-0', !active && 'opacity-30')}
        />
      </button>
    </TableHead>
  )
}

function defaultSortDirection(key: SortKey): SortDirection {
  return ['project', 'token', 'status', 'role', 'bridges'].includes(key)
    ? 'asc'
    : 'desc'
}

function sortRows(
  rows: CoverageRow[],
  sort: SortState,
  supplies: Map<
    string,
    RouterOutputs['tvsCoverage']['getSupplyEstimates'][number]
  >,
  projects: Map<string, ProjectDetails>,
  bridges: Map<string, BridgeDetails>,
) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const left = sortValue(a.row, sort.key, supplies, projects, bridges)
      const right = sortValue(b.row, sort.key, supplies, projects, bridges)
      if (left === undefined && right === undefined) return a.index - b.index
      if (left === undefined) return 1
      if (right === undefined) return -1

      const compared =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), undefined, {
              numeric: true,
            })
      return compared === 0
        ? a.index - b.index
        : sort.direction === 'asc'
          ? compared
          : -compared
    })
    .map(({ row }) => row)
}

function sortValue(
  row: CoverageRow,
  key: SortKey,
  supplies: Map<
    string,
    RouterOutputs['tvsCoverage']['getSupplyEstimates'][number]
  >,
  projects: Map<string, ProjectDetails>,
  bridges: Map<string, BridgeDetails>,
): string | number | undefined {
  const supply = supplies.get(deploymentKey(row.chain, row.address))

  switch (key) {
    case 'project':
      return projects.get(row.projectId)?.name ?? row.projectId
    case 'token':
      return row.abstractSymbol ?? row.symbol
    case 'totalSupply': {
      const value = supply?.totalSupply
      return value === undefined ? undefined : Number(value)
    }
    case 'estimatedValueUsd':
      return supply?.estimatedValueUsd
    case 'volumeUsd':
      return row.volumeUsd
    case 'status':
      return formatStatus(row.status)
    case 'role':
      return row.role ? formatInteropRole(row.role) : undefined
    case 'bridges':
      return row.bridges
        .map((bridge) => bridges.get(bridge.id)?.name ?? bridge.id)
        .join(', ')
  }
}

function formatInteropRole(role: CoverageRow['role']) {
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
    case undefined:
      return '—'
  }
}

function BridgeIconStack({
  bridges,
}: {
  bridges: (CoverageRow['bridges'][number] & {
    name: string
    iconUrl: string | undefined
  })[]
}) {
  const visible = bridges.slice(0, MAX_VISIBLE_BRIDGES)
  const hidden = bridges.slice(MAX_VISIBLE_BRIDGES)
  const names = bridges
    .map(
      (bridge) =>
        `${bridge.name} (${formatBridgeType(bridge.bridgeType)}): ${formatCurrency(bridge.volumeUsd, 'usd')}`,
    )
    .join(', ')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="-space-x-1.5 flex items-center"
          aria-label={`Via ${names}`}
          role="img"
          tabIndex={0}
          title={names}
        >
          {visible.map((bridge, index) => (
            <span
              key={`${bridge.id}:${bridge.bridgeType}`}
              aria-hidden="true"
              className="relative block size-5 shrink-0 rounded-full bg-white shadow"
              style={{ zIndex: visible.length - index }}
            >
              {bridge.iconUrl ? (
                <img
                  src={bridge.iconUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 rounded-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.visibility = 'hidden'
                  }}
                />
              ) : (
                <span className="grid size-5 place-items-center rounded-full bg-muted font-medium text-[9px] text-muted-foreground uppercase">
                  {bridge.name.slice(0, 1)}
                </span>
              )}
            </span>
          ))}
          {hidden.length > 0 && (
            <span
              aria-hidden="true"
              className="relative grid size-5 shrink-0 place-items-center rounded-full bg-muted font-medium text-[9px] text-muted-foreground shadow"
            >
              +{hidden.length}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{names}</TooltipContent>
    </Tooltip>
  )
}

function formatBridgeType(
  bridgeType: CoverageRow['bridges'][number]['bridgeType'],
) {
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
