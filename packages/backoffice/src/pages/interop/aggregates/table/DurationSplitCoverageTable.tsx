import type { ReactNode } from 'react'
import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { DurationSplitCoverageRow } from '../types'
import { durationSplitCoverageColumns } from './coverage-columns'
import { TransferTypeBadge } from './TransferTypeBadge'

interface DurationSplitCoverageTableProps {
  data: DurationSplitCoverageRow[]
  enableCsvExport?: boolean
}

export function DurationSplitCoverageTable({
  data,
  enableCsvExport = false,
}: DurationSplitCoverageTableProps) {
  const {
    filteredRowsCount,
    isSearchEnabled,
    isSearchPending,
    pageSizeOption,
    searchPlaceholder,
    searchValue,
    setPageSizeOption,
    setSearchValue,
    table,
    totalRowsCount,
  } = useTanStackTable({
    data,
    columns: durationSplitCoverageColumns,
    initialSorting: [{ id: 'notIncludedTransferTypes', desc: true }],
    initialPageSizeOption: '25',
    getRowId: (row) => `${row.projectId}-${row.bridgeType}`,
    searchPlaceholder:
      'Search protocols, bridge types, labels, and transfer types',
  })

  return (
    <>
      <div className="flex flex-col gap-3 border-b px-6 py-4 text-sm">
        <LegendItem
          badge={
            <TransferTypeBadge
              transferType="Seen in transfers"
              tone="included"
            />
          }
          label="Included in duration split and observed in the latest transfer window."
        />
        <LegendItem
          badge={
            <TransferTypeBadge
              transferType="Configured only"
              tone="configured"
            />
          }
          label="Included in duration split but not observed in the latest transfer window."
        />
        <LegendItem
          badge={
            <TransferTypeBadge transferType="Missing config" tone="missing" />
          }
          label="Observed in the latest transfer window but missing from duration split config."
        />
      </div>

      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No duration split configuration coverage data found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-duration-split-coverage-${new Date().toISOString()}.csv`
        }
        totalRowsCount={totalRowsCount}
        filteredRowsCount={filteredRowsCount}
        searchValue={isSearchEnabled ? searchValue : undefined}
        onSearchValueChange={isSearchEnabled ? setSearchValue : undefined}
        searchPlaceholder={searchPlaceholder}
        isSearchPending={isSearchPending}
      />
    </>
  )
}

function LegendItem(props: { badge: ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {props.badge}
      <span className="text-muted-foreground">{props.label}</span>
    </div>
  )
}
