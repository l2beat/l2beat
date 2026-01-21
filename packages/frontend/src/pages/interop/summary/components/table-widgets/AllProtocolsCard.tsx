import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { AllProtocolsTable } from './tables/AllProtocolsTable'

export function AllProtocolsCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  return (
    <PrimaryCard className="col-span-full flex flex-col max-md:border-divider max-md:border-b">
      <h2 className="font-bold text-heading-20 md:text-heading-24">
        All Protocols
      </h2>
      <div className="mt-2.5 text-paragraph-12 text-secondary md:text-paragraph-13">
        Maybe a short description can be added here. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Aliquam nec dolor nec enim maximus viverra
        nec quis nisi.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
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
