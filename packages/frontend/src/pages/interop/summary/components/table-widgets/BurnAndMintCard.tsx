import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import { TRANSFER_TYPE_DISPLAY } from '~/pages/interop/utils/display'
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
  const { selectedChains } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl('/interop/burn-and-mint', selectedChains)

  return (
    <PrimaryCard className="flex flex-col border-t-burn-and-mint max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em] decoration-burn-and-mint underline-offset-6 max-md:underline">
            Burn & Mint
          </h2>
          <TopNBadge n={5} />
        </div>
        <a
          href={viewAllUrl}
          className="shrink-0 whitespace-nowrap font-medium text-label-value-13 text-secondary underline decoration-divider underline-offset-[0.3em] transition-colors hover:text-primary hover:decoration-current"
        >
          View all
        </a>
      </div>
      <BetweenChainsInfo className="mt-1" />
      <div className="mt-2.5 font-normal text-label-value-13 text-secondary leading-5">
        {TRANSFER_TYPE_DISPLAY.burnAndMint.description}
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
