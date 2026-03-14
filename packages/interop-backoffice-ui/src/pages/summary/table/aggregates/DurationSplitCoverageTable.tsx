import { TanStackTable } from '~/components/table/TanStackTable'
import { useTanStackTable } from '~/components/table/useTanStackTable'
import type { SummaryAggregateDurationSplitCoverageRow } from '../types'
import { durationSplitCoverageColumns } from './duration-split-columns'
import { TransferTypeBadge } from './TransferTypeBadge'

interface DurationSplitCoverageTableProps {
  data: SummaryAggregateDurationSplitCoverageRow[]
  enableCsvExport?: boolean
}

function DurationSplitCoverageLegend() {
  return (
    <div className="flex flex-col gap-2 border-b px-6 py-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <TransferTypeBadge variant="seen">Seen in transfers</TransferTypeBadge>
        <span>
          Included in duration split and observed in latest transfers.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <TransferTypeBadge variant="configured">
          Configured only
        </TransferTypeBadge>
        <span>
          Included in duration split but not observed in latest transfers.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <TransferTypeBadge variant="missing">Missing config</TransferTypeBadge>
        <span>
          Observed in latest transfers but not included in duration split.
        </span>
      </div>
    </div>
  )
}

export function DurationSplitCoverageTable({
  data,
  enableCsvExport = false,
}: DurationSplitCoverageTableProps) {
  const { table, pageSizeOption, setPageSizeOption } = useTanStackTable({
    data,
    columns: durationSplitCoverageColumns,
    initialSorting: [{ id: 'notIncludedInDurationSplit', desc: true }],
    getRowId: (row) => `${row.projectId}:${row.bridgeType}`,
  })

  return (
    <>
      <DurationSplitCoverageLegend />
      <TanStackTable
        table={table}
        pageSizeOption={pageSizeOption}
        onPageSizeOptionChange={setPageSizeOption}
        emptyMessage="No duration split coverage rows found."
        enableCsvExport={enableCsvExport}
        getCsvFilename={() =>
          `interop-aggregates-duration-split-${new Date().toISOString()}.csv`
        }
        rowClassName="odd:bg-muted/20 hover:bg-muted/70"
      />
    </>
  )
}
