import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { getAllProtocolsColumns, type ProtocolRow } from './columns'

export function AllProtocolsTable({
  type,
  hideTypeColumn,
  entries,
  showAverageInFlightValueColumn,
  showNetMintedValueColumn,
  hideTokensColumn,
  tokenId,
}: {
  type: KnownInteropBridgeType | undefined
  entries: ProtocolEntry[]
  hideTypeColumn?: boolean
  showAverageInFlightValueColumn?: boolean
  showNetMintedValueColumn?: boolean
  hideTokensColumn?: boolean
  tokenId?: string
}) {
  const { selectedChains } = useInteropSelectedChains()
  // Phones start without Category, so the volume the table ranks by is in the
  // first view. Undefined until mounted: the server can't know the viewport.
  const breakpoint = useBreakpoint()
  const isPhone = breakpoint === 'xs' || breakpoint === 'sm'
  const defaultVisibility = useMemo(
    () => (isPhone ? { type: false } : undefined),
    [isPhone],
  )

  const columns = useMemo(
    () =>
      getAllProtocolsColumns(
        type,
        selectedChains,
        hideTypeColumn,
        showAverageInFlightValueColumn,
        showNetMintedValueColumn,
        hideTokensColumn,
        tokenId,
        breakpoint === undefined,
      ),
    [
      type,
      selectedChains,
      hideTypeColumn,
      showAverageInFlightValueColumn,
      showNetMintedValueColumn,
      hideTokensColumn,
      tokenId,
      breakpoint,
    ],
  )

  const table = useTable<ProtocolRow>('AllProtocolsTable', {
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnVisibility: defaultVisibility,
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

  return (
    <>
      {/* Only phones hide a column by default, so only they need the menu,
          and it offers just that column. */}
      <div className="mt-3 md:hidden">
        <ColumnsControls
          columns={table.getAllColumns().filter((c) => c.id === 'type')}
        />
      </div>
      <BasicTable table={table} tableWrapperClassName="pb-0" />
    </>
  )
}
