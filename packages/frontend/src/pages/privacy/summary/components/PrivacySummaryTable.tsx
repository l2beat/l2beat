import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { PrivacySummaryOptionalColumn } from '../privacyTypes'
import { getPrivacySummaryColumns } from './privacySummaryColumns'

export function PrivacySummaryTable({
  entries,
  hiddenColumns = [],
}: {
  entries: PrivacySummaryEntry[]
  hiddenColumns?: PrivacySummaryOptionalColumn[]
}) {
  const columns = useMemo(
    () => getPrivacySummaryColumns({ hiddenColumns }),
    [hiddenColumns],
  )

  const table = useTable('PrivacySummaryTable', {
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
      // No column picker, so nothing to persist: a selection saved from the
      // old single table's picker would otherwise hide columns for good.
      columnVisibility: {},
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicTable table={table} />
}
