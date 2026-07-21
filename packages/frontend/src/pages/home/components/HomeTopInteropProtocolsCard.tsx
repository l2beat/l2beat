import { useQuery } from '@tanstack/react-query'
import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  getHomeTopInteropProtocolsColumns,
  type ProtocolRow,
} from '~/pages/interop/components/table/columns'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import {
  pickTopProtocolEntries,
  TOP_PROTOCOLS_LIMIT,
} from '~/server/features/scaling/interop/utils/pickTopProtocolEntries'
import { useTRPC } from '~/trpc/React'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  interopChains: InteropChainWithIcon[]
  defaultSelectedFlowChains: string[]
}

export function HomeTopInteropProtocolsCard({
  interopChains,
  defaultSelectedFlowChains = [],
}: Props) {
  const trpc = useTRPC()
  const chainIds = useMemo(() => {
    if (defaultSelectedFlowChains.length > 0) {
      return defaultSelectedFlowChains
    }
    return interopChains.filter((chain) => !chain.isUpcoming).map((c) => c.id)
  }, [defaultSelectedFlowChains, interopChains])

  const apiSelection = useMemo(
    () => ({
      from: chainIds,
      to: chainIds,
    }),
    [chainIds],
  )

  const { data, isLoading } = useQuery(
    trpc.interop.dashboard.queryOptions(
      { ...apiSelection, limit: TOP_PROTOCOLS_LIMIT },
      {
        enabled: chainIds.length > 0,
      },
    ),
  )

  const entries = useMemo(() => pickTopProtocolEntries(data), [data])

  const columns = useMemo(
    () => getHomeTopInteropProtocolsColumns(apiSelection),
    [apiSelection],
  )

  const table = useTable<ProtocolRow>({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  })

  const showEmpty = !isLoading && (data === null || entries.length === 0)

  return (
    <HomeCard className="flex h-full min-w-0 flex-col">
      <HomeCardHeader
        title="Top interop protocols"
        href="/interop/summary"
        linkLabel="View all"
      />
      <div className="mt-3 min-w-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-[220px] w-full rounded-sm" />
        ) : showEmpty ? (
          <NoResultsInfo />
        ) : (
          <BasicTable table={table} tableWrapperClassName="pb-0" />
        )}
      </div>
    </HomeCard>
  )
}
