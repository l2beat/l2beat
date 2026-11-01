import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import { useBackendTrpc } from '~/react-query/trpc'
import { formatTimestamp } from '~/utils/formatTimestamp'
import { coverageChainColumns, coveragePluginColumns } from './columns'
import { formatCompactUsd, formatPct } from './format'
import type { CoverageChain, CoveragePlugin } from './types'

type View = 'chains' | 'plugins'

export function CoveragePage() {
  const trpc = useBackendTrpc()
  const [view, setView] = useState<View>('chains')
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.coverage.data.queryOptions(undefined, { staleTime: 60_000 }),
  )

  return (
    <TablePageLayout
      title="Coverage"
      description={
        <>
          Volume to and from chains we neither capture nor treat as one-sided,
          from the last 24 hours of captured events. Values come from event
          amounts priced with the last week of valued transfers, so events
          without an amount (plain messages) are counted but not valued. Covered
          volume is the plugin's transfers in the same window.
        </>
      }
      actions={
        <>
          <div className="flex rounded-md border p-0.5">
            <Button
              size="sm"
              variant={view === 'chains' ? 'secondary' : 'ghost'}
              onClick={() => setView('chains')}
            >
              Missing chains
            </Button>
            <Button
              size="sm"
              variant={view === 'plugins' ? 'secondary' : 'ghost'}
              onClick={() => setView('plugins')}
            >
              Plugins
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </>
      }
      summary={
        data ? (
          <>
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
              Covered {formatCompactUsd(data.coveredValueUsd)}
            </Badge>
            <Badge className="border-red-200 bg-red-50 text-red-700">
              Uncovered {formatCompactUsd(data.uncoveredValueUsd)}
            </Badge>
            <Badge variant="secondary">
              Coverage {formatPct(data.coveragePct)}
            </Badge>
            <Badge variant="secondary">
              {data.chains.length} missing chains
            </Badge>
            <Badge variant="secondary">
              {formatTimestamp(data.from)} to {formatTimestamp(data.to)} UTC
            </Badge>
          </>
        ) : (
          <Badge variant="secondary">Loading</Badge>
        )
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {data && view === 'chains' ? (
        <MissingChainsTable data={data.chains} />
      ) : null}
      {data && view === 'plugins' ? <PluginsTable data={data.plugins} /> : null}
    </TablePageLayout>
  )
}

function MissingChainsTable({ data }: { data: CoverageChain[] }) {
  const tableState = useTanStackTable({
    data,
    columns: coverageChainColumns,
    initialSorting: [{ id: 'valueUsd', desc: true }],
    getRowId: (row) => row.key,
    searchPlaceholder: 'Search chains or plugins',
  })

  return (
    <CoverageTable
      {...tableState}
      emptyMessage="Every observed chain is covered."
      csvName="interop-coverage-chains"
    />
  )
}

function PluginsTable({ data }: { data: CoveragePlugin[] }) {
  const tableState = useTanStackTable({
    data,
    columns: coveragePluginColumns,
    initialSorting: [{ id: 'uncoveredValueUsd', desc: true }],
    getRowId: (row) => row.plugin,
    searchPlaceholder: 'Search plugins',
  })

  return (
    <CoverageTable
      {...tableState}
      emptyMessage="No plugin activity in the window."
      csvName="interop-coverage-plugins"
    />
  )
}

function CoverageTable<T>(
  props: ReturnType<typeof useTanStackTable<T>> & {
    emptyMessage: string
    csvName: string
  },
) {
  return (
    <TanStackTable
      table={props.table}
      pageSizeOption={props.pageSizeOption}
      onPageSizeOptionChange={props.setPageSizeOption}
      emptyMessage={props.emptyMessage}
      fillHeight
      enableCsvExport
      getCsvFilename={() => `${props.csvName}-${new Date().toISOString()}.csv`}
      totalRowsCount={props.totalRowsCount}
      filteredRowsCount={props.filteredRowsCount}
      searchValue={props.isSearchEnabled ? props.searchValue : undefined}
      onSearchValueChange={
        props.isSearchEnabled ? props.setSearchValue : undefined
      }
      searchPlaceholder={props.searchPlaceholder}
      isSearchPending={props.isSearchPending}
    />
  )
}
