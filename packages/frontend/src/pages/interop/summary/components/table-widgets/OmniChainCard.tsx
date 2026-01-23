import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { NoResultsInfo } from '../NoResultsInfo'
import { OmniChainTable } from './tables/OmniChainTable'

export function OmniChainCard({
  entries,
  isLoading,
}: {
  entries: InteropDashboardData['entries'] | undefined
  isLoading: boolean
}) {
  return (
    <PrimaryCard className="col-span-1 flex flex-col max-md:border-divider max-md:border-b min-[1024px]:max-[1600px]:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Omnichain
        </h2>
        <a href="/interop/omnichain">
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
