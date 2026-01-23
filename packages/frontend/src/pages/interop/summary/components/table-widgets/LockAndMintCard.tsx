import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { LockAndMintTable } from './tables/LockAndMintTable'

export function LockAndMintCard({
  entries,
  isLoading,
}: {
  entries: InteropDashboardData['entries'] | undefined
  isLoading: boolean
}) {
  const { selectedChains, allChainIds } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl(
    '/interop/lock-and-mint',
    selectedChains,
    allChainIds,
  )

  return (
    <PrimaryCard className="flex flex-col max-md:border-divider max-md:border-b">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Lock & Mint
        </h2>
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
        One-sided risk. If user bridge back, the original tokens are unlocked
        and the bridge risk is removed.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries ? (
        entries.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <LockAndMintTable entries={entries} />
        )
      ) : null}
    </PrimaryCard>
  )
}
