import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { TopNBadge } from '../TopNBadge'
import type { NonMintingProtocolEntry } from './tables/getBridgeTypeEntries'
import { NonMintingTable } from './tables/NonMintingTable'

export function NonMintingCard({
  entries,
  isLoading,
}: {
  entries: NonMintingProtocolEntry[] | undefined
  isLoading: boolean
}) {
  const { selectedChains } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl('/interop/non-minting', selectedChains)

  return (
    <PrimaryCard className="flex flex-col border-t-blue-600 max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-heading-20 decoration-blue-600 underline-offset-6 max-md:underline md:text-heading-24">
            Non-minting
          </h2>
          <TopNBadge n={5} />
        </div>
        <a href={viewAllUrl}>
          <Button
            variant="outline"
            size="sm"
            className="px-4 py-[9px] leading-none"
          >
            View all
          </Button>
        </a>
      </div>
      <BetweenChainsInfo className="mt-1" />
      <div className="mt-2.5 text-paragraph-12 text-secondary md:text-paragraph-13">
        In-flight risk only. Tokens are therefore first bridged using a
        different minting bridge that needs to be separately assessed.
      </div>
      {isLoading ? (
        <Skeleton className="mt-2 h-62 w-full rounded-sm" />
      ) : entries && entries.length > 0 ? (
        <NonMintingTable entries={entries} />
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
