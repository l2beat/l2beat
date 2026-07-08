import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { IntentBridgesData } from '~/server/features/scaling/interop/getIntentBridgesData'
import { useTRPC } from '~/trpc/React'
import { useInteropSelectedChains } from '../../../components/chain-selector/InteropSelectedChainsContext'
import { Last24HoursBadge } from '../../../components/Last24HoursBadge'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import { getActiveCounts } from '../dominance/getActiveCounts'
import { getIntentBridgeColumns } from './columns'
import type { IntentBridgeRow } from './types'

export function IntentBridgesTable({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  const rows = useMemo<IntentBridgeRow[]>(
    () => (data ? buildRows(intentBridges, data) : []),
    [data, intentBridges],
  )

  const columns = useMemo(() => getIntentBridgeColumns(), [])
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
      <BasicTable
        table={table}
        isLoading={isLoading}
        skeletonCount={8}
        tableWrapperClassName="pb-0"
      />
    </PrimaryCard>
  )
}

function buildRows(
  intentBridges: InteropIntentBridge[],
  data: IntentBridgesData,
): IntentBridgeRow[] {
  const activityById = new Map(
    data.activity.entries.map((entry) => [entry.id, entry]),
  )
  const tableEntriesById = new Map(
    data.table.entries.map((entry) => [entry.id, entry]),
  )
  const countsById = getActiveCounts(data.table.entries)

  return intentBridges
    .map((bridge) => {
      const counts = countsById.get(bridge.id)
      return {
        slug: bridge.slug,
        bridge,
        activity: activityById.get(bridge.id),
        activeChainCount: counts?.chains,
        activeTokenCount: counts?.tokens,
        topRoute: tableEntriesById.get(bridge.id)?.topRoute,
      }
    })
    .toSorted((a, b) => (b.activity?.volume ?? 0) - (a.activity?.volume ?? 0))
}
