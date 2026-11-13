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
  // Descriptive columns start hidden where they'd crowd the figures: Category
  // below xl, so names stay on one line, and on phones also Transfer types,
  // so the volume the table ranks by is in the first view. The Columns menu
  // brings them back. Undefined until mounted: the server can't know the
  // viewport.
  const breakpoint = useBreakpoint()
  const isWide = breakpoint === 'xl' || breakpoint === '2xl'
  const isPhone = breakpoint === 'xs' || breakpoint === 'sm'
  const defaultVisibility = useMemo(
    () =>
      breakpoint === undefined || isWide
        ? undefined
        : { type: false, ...(isPhone ? { bridgeTypes: false } : {}) },
    [breakpoint, isWide, isPhone],
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
      {/* Only narrower screens hide columns by default, so only they need
          the menu, and it offers just those columns. */}
      <div className="mt-3 xl:hidden">
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
