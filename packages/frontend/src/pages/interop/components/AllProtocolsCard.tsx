import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { NoResultsInfo } from '../summary/components/NoResultsInfo'
import { AllProtocolsTable } from './table/AllProtocolsTable'

export function AllProtocolsCard({
  data,
  isLoading,
  hideTypeColumn,
}: {
  data: InteropDashboardData | undefined
  isLoading: boolean
  hideTypeColumn?: boolean
}) {
  return (
    <PrimaryCard className="col-span-full flex flex-col max-md:border-divider max-md:border-b">
      <h2 className="font-bold text-heading-20 md:text-heading-24">
        All Protocols
      </h2>
      {isLoading && <Skeleton className="mt-2 h-[400px] w-full rounded-sm" />}
      {data?.entries ? (
        data.entries.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <AllProtocolsTable
            entries={data.entries}
            hideTypeColumn={hideTypeColumn}
          />
        )
      ) : null}
    </PrimaryCard>
  )
}
