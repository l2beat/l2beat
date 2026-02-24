import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import { interopDescriptions } from '~/pages/interop/descriptions'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { TopNBadge } from '../TopNBadge'
import type { LockAndMintProtocolEntry } from './tables/getBridgeTypeEntries'
import { LockAndMintTable } from './tables/LockAndMintTable'

export function LockAndMintCard({
  entries,
  isLoading,
}: {
  entries: LockAndMintProtocolEntry[] | undefined
  isLoading: boolean
}) {
  const { selectedChains } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl('/interop/lock-and-mint', selectedChains)

  return (
    <PrimaryCard className="flex flex-col max-md:border-b max-md:border-b-divider md:border-t-4 md:border-t-yellow-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-heading-20 decoration-yellow-700 underline-offset-6 max-md:underline md:text-heading-24">
            Lock & Mint
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
        {interopDescriptions.lockAndMint}
      </div>
      {isLoading ? (
        <Skeleton className="mt-2 h-62 w-full rounded-sm" />
      ) : entries && entries.length > 0 ? (
        <LockAndMintTable entries={entries} />
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
