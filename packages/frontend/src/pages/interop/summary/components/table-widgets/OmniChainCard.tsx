import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { LessThenFiveInfo } from '../LessThenFiveInfo'
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
    <PrimaryCard className="col-span-1 flex h-83.5 flex-col max-md:border-divider max-md:border-b md:h-113.5 min-[1024px]:max-[1600px]:col-span-2">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Omnichain
        </h2>
        <div className="h-full rounded-sm bg-surface-secondary px-2.5 pt-1.5 pb-1 font-semibold text-secondary leading-[115%]">
          TOP 5
        </div>
      </div>
      <div className="mt-2.5 text-paragraph-12 text-secondary md:text-paragraph-13">
        The bridge risk is present at all times, as it can mint tokens on all
        chains. Flow limits might be applied.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries && entries.length === 0 ? (
        <NoResultsInfo />
      ) : (
        <OmniChainTable entries={entries} />
      )}
      {entries && entries.length < 5 && <LessThenFiveInfo />}
    </PrimaryCard>
  )
}
