import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { buildInteropUrl } from '../../../utils/buildInteropUrl'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { NoResultsInfo } from '../NoResultsInfo'
import { Top5Badge } from '../Top5Badge'
import { OmniChainTable } from './tables/OmniChainTable'

export function OmniChainCard({
  entries,
  isLoading,
}: {
  entries: InteropDashboardData['entries'] | undefined
  isLoading: boolean
}) {
  const { selectedChains, allChainIds } = useInteropSelectedChains()
  const viewAllUrl = buildInteropUrl(
    '/interop/omnichain',
    selectedChains,
    allChainIds,
  )

  return (
    <PrimaryCard className="col-span-1 flex flex-col border-t-teal-500 max-md:border-b max-md:border-b-divider md:border-t-4 min-[1024px]:max-[1600px]:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-heading-20 decoration-teal-500 underline-offset-6 max-md:underline md:text-heading-24">
            Omnichain
          </h2>
          <Top5Badge />
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
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries ? (
        entries.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <OmniChainTable entries={entries} />
        )
      ) : null}
    </PrimaryCard>
  )
}
