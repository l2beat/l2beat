import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { OmniChainTable } from './tables/OmniChainTable'

export function OmniChainCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })
  const entries = data?.protocolsByType.omniChain

  return (
    <PrimaryCard className="col-span-1 flex flex-col lg:max-xl:col-span-2">
      <h2 className="font-bold text-heading-24">Omnichain</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        The bridge risk is present at all times, as it can mint tokens on all
        chains. Flow limits might be applied.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries && entries.length === 0 ? (
        <NoResultsInfo />
      ) : (
        <OmniChainTable entires={entries} />
      )}
    </PrimaryCard>
  )
}
