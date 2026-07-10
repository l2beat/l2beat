import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { IntentBridgesData } from '~/server/features/scaling/interop/getIntentBridgesData'
import type { InteropTransferDefaults } from '../../../components/InteropTransferTrigger'
import { Last24HoursBadge } from '../../../components/Last24HoursBadge'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import {
  buildIntentBridgeRows,
  type IntentBridgeRow,
} from '../../utils/buildIntentBridgeRows'
import { getIntentBridgeColumns } from './columns'

export function IntentBridgesTable({
  intentBridges,
  data,
  isLoading,
  transfer,
}: {
  intentBridges: InteropIntentBridge[]
  data: IntentBridgesData | undefined
  isLoading: boolean
  transfer: InteropTransferDefaults
}) {
  const rows = useMemo<IntentBridgeRow[]>(
    () => (data ? buildIntentBridgeRows(intentBridges, data) : []),
    [data, intentBridges],
  )

  const columns = useMemo(() => getIntentBridgeColumns(transfer), [transfer])
  const table = useTable<IntentBridgeRow>({
    data: rows,
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

  return (
    <PrimaryCard className="overflow-hidden rounded-xl p-0 md:px-0 md:py-0">
      <div className="flex items-center gap-2 px-4 pt-4 md:px-5 md:pt-5">
        <h2 className="font-bold text-heading-20">Intent Bridge Comparison</h2>
        <Last24HoursBadge />
      </div>
      <p className="px-4 pt-1 pb-3 font-medium text-secondary text-xs leading-[1.2] md:px-5">
        Activity metrics come from indexed transfers. Intent mechanics are
        curated protocol properties.
      </p>
      <div className="px-4 md:px-5">
        <BasicTable
          table={table}
          isLoading={isLoading}
          skeletonCount={8}
          tableWrapperClassName="pb-0"
        />
      </div>
    </PrimaryCard>
  )
}
