import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import type { InteropSelection } from '../../../utils/types'
import {
  getProtocolsByVolumeColumns,
  type ProtocolByVolumeRow,
} from './columns'

export function ProtocolsByVolumeTable({
  protocols,
  selectedChains,
}: {
  protocols: ProtocolEntry[]
  selectedChains: string[]
}) {
  const rows = useMemo<ProtocolByVolumeRow[]>(
    () => protocols.map((p) => ({ ...p, icon: p.iconUrl })),
    [protocols],
  )
  const apiSelection = useMemo<InteropSelection>(
    () => ({ from: selectedChains, to: selectedChains }),
    [selectedChains],
  )
  const columns = useMemo(
    () => getProtocolsByVolumeColumns(apiSelection),
    [apiSelection],
  )
  const table = useTable<ProtocolByVolumeRow>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicTable table={table} tableWrapperClassName="pb-0" />
}
