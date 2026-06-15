import { useQuery } from '@tanstack/react-query'
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
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { pickTopProtocolEntries } from '../utils/pickTopProtocolEntries'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'
import {
  OVERVIEW_HEADER_ROW_CLASS,
  OVERVIEW_TABLE_SECTION_MT_CLASS,
  OVERVIEW_VIEW_DETAILS_LINK_CLASS,
  OVERVIEW_WIDGET_TITLE_CLASS,
} from './overviewResponsive'

interface Props {
  interopChains: InteropChainWithIcon[]
  defaultSelectedFlowChains: string[]
}

export function OverviewTopInteropProtocolsCard({
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
    trpc.interop.dashboard.queryOptions(apiSelection, {
      enabled: chainIds.length > 0,
    }),
  )

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
      <div className={cn(OVERVIEW_TABLE_SECTION_MT_CLASS, 'min-w-0 flex-1')}>
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
    <div className={OVERVIEW_HEADER_ROW_CLASS}>
      <span className={OVERVIEW_WIDGET_TITLE_CLASS}>Top interop protocols</span>
      <a className={OVERVIEW_VIEW_DETAILS_LINK_CLASS} href="/interop/summary">
        View all
        <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
      </a>
    </div>
  )
}
