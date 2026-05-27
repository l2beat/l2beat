import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { ChevronIcon } from '~/icons/Chevron'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  getOverviewTopInteropProtocolsColumns,
  type ProtocolRow,
} from '~/pages/interop/components/table/columns'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { pickTopProtocolEntries } from '../utils/pickTopProtocolEntries'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'

interface Props {
  interopChains: InteropChainWithIcon[]
  defaultSelectedFlowChains: string[]
}

export function OverviewTopInteropProtocolsCard({
  interopChains,
  defaultSelectedFlowChains = [],
}: Props) {
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

  const { data, isLoading } = api.interop.dashboard.useQuery(apiSelection, {
    enabled: chainIds.length > 0,
  })

  const entries = useMemo(() => pickTopProtocolEntries(data), [data])

  const columns = useMemo(
    () => getOverviewTopInteropProtocolsColumns(apiSelection),
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
    <PrimaryCard
      className={cn(
        OVERVIEW_CARD_PADDING_CLASS,
        'flex h-full min-w-0 flex-col',
      )}
    >
      <Header />
      <div className="mt-3 min-w-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-[220px] w-full rounded-sm" />
        ) : showEmpty ? (
          <NoResultsInfo />
        ) : (
          <BasicTable table={table} tableWrapperClassName="pb-0" />
        )}
      </div>
    </PrimaryCard>
  )
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl">Top interop protocols</span>
      <a
        className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none"
        href="/interop/summary"
      >
        View all
        <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
      </a>
    </div>
  )
}
