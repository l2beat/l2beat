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
  // Phones start without the descriptive columns, Category and Transfer
  // types, so the volume the table ranks by is in the first view (DESIGN.md
  // "Tables"); the Columns menu brings them back. From md every column shows
  // and the table scrolls sideways when it's wider than the card. Undefined
  // until mounted: the server can't know the viewport.
  const breakpoint = useBreakpoint()
  const isPhone = breakpoint === 'xs' || breakpoint === 'sm'
  const defaultVisibility = useMemo(
    () => (isPhone ? { type: false, bridgeTypes: false } : undefined),
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
      {/* Only phones hide columns by default, so only they need the menu,
          and it offers just those columns. */}
      <div className="mt-3 md:hidden">
        <ColumnsControls
          columns={table
            .getAllColumns()
            .filter((c) => c.id === 'type' || c.id === 'bridgeTypes')}
        />
      </div>
      <BasicTable table={table} tableWrapperClassName="pb-0" />
    </>
  )
}
