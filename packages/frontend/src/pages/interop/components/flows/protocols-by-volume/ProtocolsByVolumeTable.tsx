import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import type { AnchoredInteropSelection } from '../../../utils/types'
import {
  getProtocolsByVolumeColumns,
  type ProtocolByVolumeRow,
} from './columns'

export function ProtocolsByVolumeTable({
  protocols,
  selectedChains,
  anchorChain,
  isLoading = false,
}: {
  protocols: ProtocolEntry[]
  selectedChains: string[]
  anchorChain?: string
  isLoading?: boolean
}) {
  const rows = useMemo<ProtocolByVolumeRow[]>(
    () => protocols.map((p) => ({ ...p, icon: p.iconUrl })),
    [protocols],
  )
  const apiSelection = useMemo<AnchoredInteropSelection>(
    () => ({ from: selectedChains, to: selectedChains, anchorChain }),
    [selectedChains, anchorChain],
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

  return (
    <BasicTable
      table={table}
      tableWrapperClassName="pb-0"
      skeletonCount={6}
      isLoading={isLoading}
    />
  )
}
