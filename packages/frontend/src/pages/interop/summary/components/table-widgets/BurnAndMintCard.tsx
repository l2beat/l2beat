import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { TopNBadge } from '../TopNBadge'
import { BurnAndMintTable } from './tables/BurnAndMintTable'
import type { BurnAndMintProtocolEntry } from './tables/getBridgeTypeEntries'

export function BurnAndMintCard({
  entries,
  isLoading,
}: {
  entries: BurnAndMintProtocolEntry[] | undefined
  isLoading: boolean
}) {
  const { selectedChains, allChainIds } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl(
    '/interop/burn-and-mint',
    selectedChains,
    allChainIds,
  )

  return (
    <PrimaryCard className="flex flex-col border-t-teal-500 max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-heading-20 decoration-teal-500 underline-offset-6 max-md:underline md:text-heading-24">
            Burn & Mint
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
      <div className="mt-2.5 text-paragraph-12 text-secondary md:text-paragraph-13">
        The bridge risk is present at all times, as it can mint tokens on all
        chains. Flow limits might be applied.
      </div>
      {isLoading ? (
        <Skeleton className="mt-2 h-62 w-full rounded-sm" />
      ) : entries && entries.length > 0 ? (
        <BurnAndMintTable entries={entries} />
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
