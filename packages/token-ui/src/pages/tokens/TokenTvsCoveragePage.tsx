import { formatCurrency } from '@l2beat/shared-pure'
import type { RouterOutputs } from '@l2beat/token-backend'
import { useQueries, useQuery } from '@tanstack/react-query'
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
type PluginDetails = CoverageData['plugins'][number]
type SupplyEstimate = RouterOutputs['tvsCoverage']['getSupplyEstimates'][number]
type SupplyChangeEvidence =
  RouterOutputs['tvsCoverage']['getSupplyChangeEvidence'][number]
type VaultAsset = NonNullable<SupplyEstimate['vaultAsset']>
type CoverageFilter = 'missing' | 'included' | 'all'
type WindowHours = 24 | 72 | 168
type SortDirection = 'asc' | 'desc'
type SortKey =
  | 'chain'
  | 'token'
  | 'totalSupply'
  | 'potentialTvsUsd'
  | 'volumeUsd'
  | 'included'
  | 'role'
  | 'plugins'

interface SortState {
  key: SortKey
  direction: SortDirection
}

const PAGE_SIZE = 25
const MAX_SORTABLE_ROWS = 100
const MAX_VISIBLE_PLUGINS = 4
const SUPPLY_REQUEST_DEBOUNCE_MS = 300
const COINGECKO_CIRCULATING_WARNING_RATIO = 1.1
const CASE_SENSITIVE_TOKEN_ADDRESS_CHAINS = new Set(['solana', 'tron'])

export function TokenTvsCoveragePage() {
  const trpc = useTRPC()
  const [hours, setHours] = useState<WindowHours>(168)
  const [chain, setChain] = useState('all')
  const [coverage, setCoverage] = useState<CoverageFilter>('missing')
  const [minimumVolume, setMinimumVolume] = useState('0')
  const [search, setSearch] = useState('')
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE)
  const [sort, setSort] = useState<SortState>({
    key: 'volumeUsd',
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
      { hours },
      {
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    ),
  )

  useEffect(() => {
    if (
      chain !== 'all' &&
      data !== undefined &&
      !data.chains.some((candidate) => candidate.chain === chain)
    ) {
      setChain('all')
    }
  }, [chain, data])

  const chainsById = useMemo(
    () => new Map(data?.chains.map((chain) => [chain.chain, chain])),
    [data],
  )
  const pluginsById = useMemo(
    () => new Map((data?.plugins ?? []).map((plugin) => [plugin.id, plugin])),
    [data],
  )
  const tvsDeploymentKeys = useMemo(
    () =>
      new Set(
        (data?.tvsDeployments ?? []).map((deployment) =>
          projectTvsDeploymentKey(
            deployment.projectChain,
            deployment.tokenChain,
            deployment.address,
          ),
        ),
      ),
    [data],
  )
  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const threshold = Number(minimumVolume) || 0

    return (data?.rows ?? []).filter((row) => {
      const chainInfo = chainsById.get(row.chain)
      if (chain !== 'all' && row.chain !== chain) return false
      if (coverage !== 'all' && (coverage === 'included') !== row.included) {
        return false
      }
      if (row.volumeUsd < threshold) return false
      if (!needle) return true

      return [
        row.chain,
        chainInfo?.chainName,
        chainInfo?.projectName,
        row.address,
        row.symbol,
        row.abstractSymbol,
        row.issuer,
        row.role,
        ...row.plugins,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [chain, chainsById, coverage, data, minimumVolume, search])

  const rankedRows = useMemo(
    () => filteredRows.slice(0, MAX_SORTABLE_ROWS),
    [filteredRows],
  )
  const supplyRequests = useMemo(
    () =>
      rankedRows.map((row) => ({
        chain: row.chain,
        address: row.address,
      })),
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

  const supplyRequestBatches = useMemo(
    () => chunks(debouncedSupplyRequests, PAGE_SIZE),
    [debouncedSupplyRequests],
  )
  const supplyQueries = useQueries({
    queries: supplyRequestBatches.map((requests) =>
      trpc.tvsCoverage.getSupplyEstimates.queryOptions(requests, {
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
      }),
    ),
  })
  const supplyEstimates = useMemo(
    () => supplyQueries.flatMap((query) => query.data ?? []),
    [supplyQueries],
  )
  const isFetchingSupplies = supplyQueries.some((query) => query.isFetching)
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
  const supplyChangeRequests = useMemo(
    () =>
      rankedRows
        .filter((row) =>
          row.pluginRoles.some(({ roles }) =>
            roles.some((role) => role === 'minted' || role === 'burnAndMint'),
          ),
        )
        .map((row) => ({ chain: row.chain, address: row.address })),
    [rankedRows],
  )
  const [debouncedSupplyChangeRequests, setDebouncedSupplyChangeRequests] =
    useState(supplyChangeRequests)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSupplyChangeRequests(supplyChangeRequests),
      SUPPLY_REQUEST_DEBOUNCE_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [supplyChangeRequests])

  const supplyChangeRequestBatches = useMemo(
    () => chunks(debouncedSupplyChangeRequests, PAGE_SIZE),
    [debouncedSupplyChangeRequests],
  )
  const supplyChangeQueries = useQueries({
    queries: supplyChangeRequestBatches.map((requests) =>
      trpc.tvsCoverage.getSupplyChangeEvidence.queryOptions(requests, {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
      }),
    ),
  })
  const supplyChangeByDeployment = useMemo(
    () =>
      new Map(
        supplyChangeQueries
          .flatMap((query) => query.data ?? [])
          .map((evidence) => [
            deploymentKey(evidence.chain, evidence.address),
            evidence,
          ]),
      ),
    [supplyChangeQueries],
  )
  const isFetchingSupplyChanges = supplyChangeQueries.some(
    (query) => query.isFetching,
  )
  const sortedRows = useMemo(
    () =>
      sortRows(rankedRows, sort, supplyByDeployment, chainsById, pluginsById),
    [chainsById, pluginsById, rankedRows, sort, supplyByDeployment],
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
              value={String(hours)}
              onValueChange={(value) => {
                setHours(Number(value) as WindowHours)
                setVisibleRows(PAGE_SIZE)
              }}
            >
              <SelectTrigger size="sm" className="w-28" aria-label="Window">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={chain}
              onValueChange={(value) => {
                setChain(value)
                setVisibleRows(PAGE_SIZE)
              }}
            >
              <SelectTrigger size="sm" className="w-40" aria-label="Chain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All chains</SelectItem>
                {data?.chains.map((chain) => (
                  <SelectItem key={chain.chain} value={chain.chain}>
                    {chain.chainName}
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
                className="w-28"
                aria-label="TVS coverage"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="included">Included</SelectItem>
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
              disabled={
                isFetching || isLoadingSupplies || isFetchingSupplyChanges
              }
              aria-label={
                isFetching || isLoadingSupplies || isFetchingSupplyChanges
                  ? 'Refreshing'
                  : 'Refresh'
              }
              onClick={() => {
                void refetchCoverage()
                for (const query of supplyQueries) void query.refetch()
                for (const query of supplyChangeQueries) void query.refetch()
              }}
            >
              <RotateCwIcon
                className={cn(
                  (isFetching ||
                    isLoadingSupplies ||
                    isFetchingSupplyChanges) &&
                    'animate-spin',
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
                    label="Chain"
                    sortKey="chain"
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
                    label="Supply value"
                    sortKey="potentialTvsUsd"
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
                    className="w-20"
                    label="TVS"
                    sortKey="included"
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
                    sortKey="plugins"
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
                    const chainInfo = chainsById.get(row.chain)
                    const symbol = row.abstractSymbol ?? row.symbol ?? 'Unknown'
                    const supply = supplyByDeployment.get(
                      deploymentKey(row.chain, row.address),
                    )
                    const supplyChange = supplyChangeByDeployment.get(
                      deploymentKey(row.chain, row.address),
                    )
                    const vaultAssetIncluded = supply?.vaultAsset
                      ? tvsDeploymentKeys.has(
                          projectTvsDeploymentKey(
                            row.chain,
                            row.chain,
                            supply.vaultAsset.address,
                          ),
                        )
                      : false
                    const rolesByPlugin = new Map(
                      (row.pluginRoles ?? []).map(({ plugin, roles }) => [
                        plugin,
                        roles,
                      ]),
                    )

                    return (
                      <TableRow key={`${row.chain}:${row.address}`}>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium">
                            {chainInfo?.projectIconUrl && (
                              <img
                                src={chainInfo.projectIconUrl}
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
                            {chainInfo?.chainName ?? row.chain}
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
                                  <VaultAssetBadges
                                    asset={supply.vaultAsset}
                                    included={vaultAssetIncluded}
                                    chainName={
                                      chainInfo?.chainName ?? row.chain
                                    }
                                  />
                                )}
                              </div>
                              <Address
                                row={row}
                                explorerUrl={chainInfo?.explorerUrl}
                              />
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
                            {supplyChange?.bridgeShareOfSupplyChange !==
                              undefined && (
                              <SupplyChangeBadge evidence={supplyChange} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {supply?.potentialTvsUsd === undefined
                            ? isLoadingSupplies
                              ? '…'
                              : '—'
                            : formatCurrency(supply.potentialTvsUsd, 'usd')}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <div className="font-medium">
                            {formatCurrency(row.volumeUsd, 'usd')}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {row.transferCount.toLocaleString()} txs
                            {row.unvaluedTransferCount > 0 && (
                              <>
                                {' · '}
                                {row.unvaluedTransferCount.toLocaleString()}{' '}
                                unvalued
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <CoverageBadge included={row.included} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatInteropRole(row.role)}
                        </TableCell>
                        <TableCell>
                          <PluginIconStack
                            plugins={row.plugins.map((id) => ({
                              ...(pluginsById.get(id) ?? {
                                id,
                                name: id,
                                iconUrl: undefined,
                              }),
                              roles: rolesByPlugin.get(id),
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

function CoverageBadge({ included }: { included: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        included
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
      }
    >
      {included ? 'Included' : 'Missing'}
    </Badge>
  )
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

function projectTvsDeploymentKey(
  projectChain: string,
  tokenChain: string,
  address: string,
) {
  return `${projectChain}:${deploymentKey(tokenChain, address)}`
}

function VaultAssetBadges({
  asset,
  included,
  chainName,
}: {
  asset: VaultAsset
  included: boolean
  chainName: string
}) {
  const label = asset.symbol ?? shortAddress(asset.address)

  return (
    <>
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
      {included && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="inline-flex"
              tabIndex={0}
              aria-label={`${label} is already included in ${chainName} TVS`}
            >
              <Badge
                variant="outline"
                className="h-5 border-amber-300 bg-amber-50 px-1.5 font-normal text-[10px] text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
              >
                In TVS
              </Badge>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {label} is already used by {chainName} TVS. Supply value can
            overlap.
          </TooltipContent>
        </Tooltip>
      )}
    </>
  )
}

function SupplyChangeBadge({ evidence }: { evidence: SupplyChangeEvidence }) {
  const percentage = evidence.bridgeShareOfSupplyChange
  if (percentage === undefined) return null
  const percentageLabel = formatBridgePercentage(percentage)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex"
          tabIndex={0}
          aria-label={`Tracked Interop net is ${percentageLabel} of the total supply change`}
        >
          <Badge
            variant="outline"
            className="h-5 px-1.5 font-normal text-[10px] text-muted-foreground"
          >
            Δ via Interop: {percentageLabel}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent className="w-72 space-y-1.5 text-left text-xs">
        <div className="font-medium">Retained Interop window</div>
        <div className="opacity-75">
          {formatEvidenceTimestamp(evidence.from)} →{' '}
          {formatEvidenceTimestamp(evidence.to)}
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 tabular-nums">
          <span className="opacity-75">totalSupply()</span>
          <span className="text-right">
            {formatTokenSupply(evidence.supplyStart)} →{' '}
            {formatTokenSupply(evidence.supplyEnd)}
          </span>
          <span className="opacity-75">Supply Δ</span>
          <span className="text-right">
            {formatSignedTokenAmount(evidence.supplyChange)}
          </span>
          <span className="opacity-75">Interop mints</span>
          <span className="text-right">
            {formatSignedTokenAmount(evidence.interopMinted)}
          </span>
          <span className="opacity-75">Interop burns</span>
          <span className="text-right">
            {formatBurnedTokenAmount(evidence.interopBurned)}
          </span>
          <span className="opacity-75">Interop net</span>
          <span className="text-right">
            {formatSignedTokenAmount(evidence.interopNet)}
          </span>
          <span className="opacity-75">Unexplained Δ</span>
          <span className="text-right">
            {formatSignedTokenAmount(evidence.unexplainedChange)}
          </span>
          <span className="opacity-75">Transfers</span>
          <span className="text-right">
            {evidence.transferCount.toLocaleString()}
          </span>
        </div>
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
    circulatingSupply <= 0 ||
    !Number.isFinite(totalSupply) ||
    totalSupply <= circulatingSupply * COINGECKO_CIRCULATING_WARNING_RATIO
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
        <div className="opacity-75">Global CoinGecko value</div>
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

function formatSignedTokenAmount(value: string) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return value
  if (numeric === 0) return '0'
  return `${numeric > 0 ? '+' : '−'}${formatTokenSupply(
    String(Math.abs(numeric)),
  )}`
}

function formatBurnedTokenAmount(value: string) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return value
  if (numeric === 0) return '0'
  return `−${formatTokenSupply(String(Math.abs(numeric)))}`
}

function formatBridgePercentage(value: number) {
  if (value > 999) return '>999%'
  if (value < -999) return '<−999%'
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value)}%`
}

function formatEvidenceTimestamp(timestamp: number) {
  return `${new Date(timestamp * 1000)
    .toISOString()
    .slice(0, 16)
    .replace('T', ' ')} UTC`
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
  return ['chain', 'token', 'included', 'role', 'plugins'].includes(key)
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
  chains: Map<string, CoverageData['chains'][number]>,
  plugins: Map<string, PluginDetails>,
) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const left = sortValue(a.row, sort.key, supplies, chains, plugins)
      const right = sortValue(b.row, sort.key, supplies, chains, plugins)
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
  chains: Map<string, CoverageData['chains'][number]>,
  plugins: Map<string, PluginDetails>,
): string | number | undefined {
  const supply = supplies.get(deploymentKey(row.chain, row.address))

  switch (key) {
    case 'chain':
      return chains.get(row.chain)?.chainName ?? row.chain
    case 'token':
      return row.abstractSymbol ?? row.symbol
    case 'totalSupply': {
      const value = supply?.totalSupply
      return value === undefined ? undefined : Number(value)
    }
    case 'potentialTvsUsd':
      return supply?.potentialTvsUsd
    case 'volumeUsd':
      return row.volumeUsd
    case 'included':
      return row.included ? 'Included' : 'Missing'
    case 'role':
      return row.role ? formatInteropRole(row.role) : undefined
    case 'plugins':
      return row.plugins.map((id) => plugins.get(id)?.name ?? id).join(', ')
  }
}

function chunks<T>(values: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) =>
    values.slice(index * size, (index + 1) * size),
  )
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

function PluginIconStack({
  plugins,
}: {
  plugins: (PluginDetails & {
    roles?: CoverageRow['pluginRoles'][number]['roles']
  })[]
}) {
  const visible = plugins.slice(0, MAX_VISIBLE_PLUGINS)
  const hidden = plugins.slice(MAX_VISIBLE_PLUGINS)
  const names = plugins
    .map((plugin) =>
      plugin.roles && plugin.roles.length > 0
        ? `${plugin.name}: ${plugin.roles
            .map((role) => formatInteropRole(role))
            .join(' + ')}`
        : plugin.name,
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
          {visible.map((plugin, index) => (
            <span
              key={plugin.id}
              aria-hidden="true"
              className="relative block size-5 shrink-0 rounded-full bg-white shadow"
              style={{ zIndex: visible.length - index }}
            >
              {plugin.iconUrl ? (
                <img
                  src={plugin.iconUrl}
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
                  {plugin.name.slice(0, 1)}
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
