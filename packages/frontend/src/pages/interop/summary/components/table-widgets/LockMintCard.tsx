import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { LockMintTable } from './tables/LockMintTable'

export function LockMintCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })
  const entries = data?.protocolsByType.lockMint

  return (
    <PrimaryCard className="flex flex-col max-md:border-divider max-md:border-b">
      <h2 className="font-bold text-heading-24">Lock & Mint</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        One-sided risk. If user bridge back, the original tokens are unlocked
        and the bridge risk is removed.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries && entries.length === 0 ? (
        <NoResultsInfo />
      ) : (
        <LockMintTable entries={entries} />
      )}
    </PrimaryCard>
  )
}
