import { getCoreRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { getHomeTopInteropProtocolsColumns } from '~/pages/interop/components/table/columns'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import { TopNBadge } from '~/pages/interop/summary/components/TopNBadge'
import type { CompactProtocolEntry } from '~/server/features/layer2s/interop/types'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  protocols: CompactProtocolEntry[]
}

export function HomeTopInteropProtocolsCard({ protocols }: Props) {
  const columns = useMemo(() => getHomeTopInteropProtocolsColumns(), [])

  const table = useTable<CompactProtocolEntry>('HomeTopInteropProtocolsCard', {
    data: protocols,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  })

  return (
    <HomeCard className="flex h-full min-w-0 flex-col">
      <HomeCardHeader
        title="Interop"
        badge={<TopNBadge n={5} />}
        href="/interop/summary"
        linkLabel="View all"
      />
      <div className="mt-2 min-w-0 flex-1">
        {protocols.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <BasicTable table={table} tableWrapperClassName="pb-0" compact />
        )}
      </div>
    </HomeCard>
  )
}
