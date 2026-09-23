import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { customColumns, publicColumns } from './columns'

export function DaRiskTable({
  items,
  excludeBridge = false,
  caption,
}: {
  items: DaRiskEntry[]
  caption: string
  excludeBridge?: boolean
}) {
  const table = useTable('DaRiskTable', {
    columns: excludeBridge ? customColumns : publicColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable caption={caption} table={table} />
    </>
  )
}
