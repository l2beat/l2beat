import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { getAllProtocolsColumns, type ProtocolRow } from './columns'

export function AllProtocolsTable({
  type,
  hideTypeColumn,
  entries,
  showAverageInFlightValueColumn,
  showNetMintedValueColumn,
}: {
  type: KnownInteropBridgeType | undefined
  entries: ProtocolEntry[]
  hideTypeColumn?: boolean
  showAverageInFlightValueColumn?: boolean
  showNetMintedValueColumn?: boolean
}) {
  const { selectedChains } = useInteropSelectedChains()

  const columns = useMemo(
    () =>
      getAllProtocolsColumns(
        type,
        selectedChains,
        hideTypeColumn,
        showAverageInFlightValueColumn,
        showNetMintedValueColumn,
      ),
    [
      type,
      selectedChains,
      hideTypeColumn,
      showAverageInFlightValueColumn,
      showNetMintedValueColumn,
    ],
  )

  const table = useTable<ProtocolRow>({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
