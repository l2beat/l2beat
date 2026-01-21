import type { InteropConfig } from '@l2beat/config'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { NoResultsInfo } from '../NoResultsInfo'
import { AllProtocolsTable } from './tables/AllProtocolsTable'

export function AllProtocolsCard({
  type,
}: {
  type?: InteropConfig['bridgeType']
}) {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
    type,
  })

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
          <AllProtocolsTable entries={data.entries} />
        )
      ) : null}
    </PrimaryCard>
  )
}
