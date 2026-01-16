import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { NonMintingTable } from './tables/NonMintingTable'

export function NonMintingCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })
  const entries = data?.protocolsByType.nonMinting

  return (
    <PrimaryCard className="flex flex-col">
      <h2 className="font-bold text-heading-24">Non-minting</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        In-light risk only. Tokens are therefore first bridged using a different
        minting bridge that needs to be separately assessed.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries && entries.length === 0 ? (
        <NoResultsInfo />
      ) : (
        <NonMintingTable entires={entries} />
      )}
    </PrimaryCard>
  )
}
