import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { PrivacySummaryOptionalColumn } from '../privacySummaryViews'
import {
  getPrivacySummaryColumns,
  type PrivacyTableView,
} from './privacySummaryColumns'

export function PrivacySummaryTable({
  entries,
  view,
  hiddenColumns = [],
  compact,
}: {
  entries: PrivacySummaryEntry[]
  view: PrivacyTableView
  hiddenColumns?: PrivacySummaryOptionalColumn[]
  compact?: boolean
}) {
  const columns = useMemo(
    () => getPrivacySummaryColumns({ view, hiddenColumns, compact }),
    [view, hiddenColumns, compact],
  )

  // One persisted column selection per layout: the layouts have different
  // columns, and hiding one in the matrix should not hide it in the grid.
  const table = useTable(`PrivacySummaryTable-${view}`, {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // The server already hands the entries over in privacy order; starting the
    // table on the same column marks its arrow so the ordering is visible.
    initialState: {
      sorting: [{ id: 'privacy', desc: true }],
    },
    state: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      {!compact && <ColumnsControls columns={table.getAllColumns()} />}
      <BasicTable table={table} />
    </>
  )
}
