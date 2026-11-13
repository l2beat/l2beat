import { getCoreRowModel } from '@tanstack/react-table'
import { type ReactNode, useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
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
  filters,
}: {
  protocols: ProtocolEntry[]
  selectedChains: string[]
  anchorChain?: string
  isLoading?: boolean
  /** The filters control, shown in one row with the phones' Columns menu. */
  filters?: ReactNode
}) {
  const rows = useMemo<ProtocolByVolumeRow[]>(
    () => protocols.map((p) => ({ ...p, icon: p.iconUrl })),
    [protocols],
  )
  const apiSelection = useMemo<AnchoredInteropSelection>(
    () => ({ from: selectedChains, to: selectedChains, anchorChain }),
    [selectedChains, anchorChain],
  )
  // Phones start without Category, so the volume the table ranks by is in the
  // first view. Undefined until mounted: the server can't know the viewport.
  const breakpoint = useBreakpoint()
  const isPhone = breakpoint === 'xs' || breakpoint === 'sm'
  const defaultVisibility = useMemo(
    () => (isPhone ? { type: false } : undefined),
    [isPhone],
  )
  const columns = useMemo(
    () => getProtocolsByVolumeColumns(apiSelection, breakpoint === undefined),
    [apiSelection, breakpoint],
  )
  const table = useTable<ProtocolByVolumeRow>('ProtocolsByVolumeTable', {
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    manualFiltering: true,
    initialState: {
      columnVisibility: defaultVisibility,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <div className="mt-4 flex flex-wrap items-start gap-2">
        {filters}
        {/* Only phones hide a column by default, so only they need the menu,
            and it offers just that column. */}
        <div className="md:hidden">
          <ColumnsControls
            columns={table.getAllColumns().filter((c) => c.id === 'type')}
          />
        </div>
      </div>
      <BasicTable
        table={table}
        tableWrapperClassName="pb-0"
        skeletonCount={6}
        isLoading={isLoading}
      />
    </>
  )
}
