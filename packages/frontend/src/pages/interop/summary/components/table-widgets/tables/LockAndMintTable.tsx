import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { getLockAndMintColumns, type LockAndMintProtocolRow } from './columns'
import type { LockAndMintProtocolEntry } from './getBridgeTypeEntries'

export function LockAndMintTable({
  entries,
}: {
  entries: LockAndMintProtocolEntry[]
}) {
  const { buildUrl } = useInteropSelectedChains()
  const columns = useMemo(
    () =>
      getLockAndMintColumns((slug) => buildUrl(`/interop/protocols/${slug}`)),
    [buildUrl],
  )

  const table = useTable<LockAndMintProtocolRow>({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
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

  return (
    <BasicTable table={table} tableWrapperClassName="pb-0 md:min-h-[210px]" />
  )
}
