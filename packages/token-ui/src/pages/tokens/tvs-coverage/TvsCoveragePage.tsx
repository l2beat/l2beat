import { formatCurrency } from '@l2beat/shared-pure'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RotateCwIcon, TriangleAlertIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { Checkbox } from '~/components/core/Checkbox'
import { Input } from '~/components/core/Input'
import { Label } from '~/components/core/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import { WithTooltip } from './cells'
import {
  defaultDirection,
  type Filters,
  filterRows,
  formatAge,
  formatSnapshotDay,
  type Names,
  type Option,
  type SideFilter,
  type Snapshot,
  type Sort,
  STATUS_FILTERS,
  sortRows,
  sumValue,
} from './rows'
import { TvsCoverageTable } from './TvsCoverageTable'

const PAGE_SIZE = 50

const SIDE_FILTERS: Option<SideFilter>[] = [
  { value: 'all', label: 'Chain + escrow' },
  { value: 'chain', label: 'On chain' },
  { value: 'escrow', label: 'In escrow' },
]

const SEEN_FILTERS: Option<string>[] = [
  { value: 'any', label: 'Seen any time' },
  { value: '7', label: 'Seen in 7 days' },
  { value: '30', label: 'Seen in 30 days' },
]

const INITIAL_FILTERS: Filters = {
  status: 'missing',
  project: 'all',
  side: 'all',
  seenWithinDays: undefined,
  minValueUsd: 0,
  search: '',
  showIgnored: false,
}

export function TvsCoveragePage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data, error, isError, isLoading } = useQuery(
    trpc.tvsCoverage.get.queryOptions(undefined, {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }),
  )
  const invalidate = () =>
    queryClient.invalidateQueries(trpc.tvsCoverage.get.queryFilter())
  const refresh = useMutation(
    trpc.tvsCoverage.refresh.mutationOptions({
      onSuccess: async () => {
        await invalidate()
        toast.success('Snapshot rebuilt')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to rebuild the snapshot')
      },
    }),
  )

  return (
    <AppLayout className="min-w-0">
      <Card className="flex h-[calc(100vh-16px)] flex-col">
        {isLoading ? (
          <LoadingState className="h-full" />
        ) : isError ? (
          <div className="grid h-full place-items-center p-4 text-center text-destructive text-sm">
            {error.message}
          </div>
        ) : data ? (
          <TvsGaps
            snapshot={data}
            isRefreshing={refresh.isPending}
            onRefresh={() => refresh.mutate()}
          />
        ) : null}
      </Card>
    </AppLayout>
  )
}

function TvsGaps({
  snapshot,
  isRefreshing,
  onRefresh,
}: {
  snapshot: Snapshot
  isRefreshing: boolean
  onRefresh: () => void
}) {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sort, setSort] = useState<Sort>({ key: 'value', direction: 'desc' })
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE)

  const names = useMemo<Names>(() => {
    const projects = new Map(snapshot.projects.map((p) => [p.id, p.name]))
    const bridges = new Map(snapshot.bridges.map((b) => [b.id, b.name]))
    return {
      project: (id) => projects.get(id) ?? id,
      bridge: (id) => bridges.get(id) ?? id,
    }
  }, [snapshot])
  const projectOptions = useMemo((): Option<string>[] => {
    const ids = new Set(snapshot.rows.map((row) => row.projectId))
    return [
      { value: 'all', label: 'All projects' },
      ...snapshot.projects
        .filter((project) => ids.has(project.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((project) => ({ value: project.id, label: project.name })),
    ]
  }, [snapshot])
  const rows = useMemo(
    () =>
      sortRows(
        filterRows(snapshot.rows, filters, names, snapshot.window.to),
        sort,
        names,
      ),
    [filters, names, snapshot, sort],
  )

  const showMore = useCallback(
    () => setVisibleRows((current) => current + PAGE_SIZE),
    [],
  )
  const update = (change: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...change }))
    setVisibleRows(PAGE_SIZE)
  }
  const onSort = (key: Sort['key']) =>
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : defaultDirection(key),
    }))

  const totalValue = sumValue(rows)
  const now = Math.floor(Date.now() / 1000)

  return (
    <>
      <CardHeader className="gap-3 border-b">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <CardTitle>TVS gaps</CardTitle>
          <CardDescription>
            {rows.length.toLocaleString()} rows ·{' '}
            {formatCurrency(totalValue, 'usd')} est. value ·{' '}
            {snapshot.window.days} days of interop data until{' '}
            {formatSnapshotDay(snapshot.window.to)} · chain rows with at least{' '}
            {formatCurrency(snapshot.minChainVolumeUsd, 'usd')} volume · built{' '}
            {formatAge(snapshot.generatedAt, now)}
          </CardDescription>
          {snapshot.warnings.length > 0 && (
            <WithTooltip
              content={snapshot.warnings.map((warning) => (
                <div key={warning}>{warning}</div>
              ))}
            >
              <span className="flex items-center gap-1 text-amber-700 text-xs dark:text-amber-300">
                <TriangleAlertIcon className="size-3.5" />
                {snapshot.warnings.length === 1
                  ? '1 warning'
                  : `${snapshot.warnings.length} warnings`}
              </span>
            </WithTooltip>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="ml-auto size-8 self-center"
            disabled={isRefreshing}
            aria-label="Rebuild snapshot"
            title="Rebuild snapshot"
            onClick={onRefresh}
          >
            <RotateCwIcon className={cn(isRefreshing && 'animate-spin')} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="TVS status"
            value={filters.status}
            onChange={(status) => update({ status })}
            options={STATUS_FILTERS}
          />
          <FilterSelect
            label="Project"
            value={filters.project}
            onChange={(project) => update({ project })}
            options={projectOptions}
          />
          <FilterSelect
            label="Side"
            value={filters.side}
            onChange={(side) => update({ side })}
            options={SIDE_FILTERS}
          />
          <FilterSelect
            label="Last seen"
            value={String(filters.seenWithinDays ?? 'any')}
            onChange={(days) =>
              update({
                seenWithinDays: days === 'any' ? undefined : Number(days),
              })
            }
            options={SEEN_FILTERS}
          />
          <Input
            type="number"
            min="0"
            step="10000"
            inputMode="numeric"
            value={filters.minValueUsd || ''}
            onChange={(event) =>
              update({ minValueUsd: Number(event.target.value) || 0 })
            }
            className="h-8 w-28"
            placeholder="Min value $"
            aria-label="Minimum value"
          />
          <Input
            type="search"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            className="h-8 w-40 min-w-40 flex-1"
            placeholder="Token, address, project or bridge"
            aria-label="Search by token, address, project or bridge"
            autoComplete="off"
          />
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="tvs-coverage-ignored"
              checked={filters.showIgnored}
              onCheckedChange={(checked) =>
                update({ showIgnored: checked === true })
              }
            />
            <Label
              htmlFor="tvs-coverage-ignored"
              className="whitespace-nowrap text-xs"
            >
              Show ignored
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto [&_[data-slot=table-container]]:overflow-visible">
        <TvsCoverageTable
          rows={rows.slice(0, visibleRows)}
          totalRows={rows.length}
          snapshot={snapshot}
          sort={sort}
          onSort={onSort}
          onShowMore={showMore}
        />
      </CardContent>
    </>
  )
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger size="sm" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            description={option.description}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
