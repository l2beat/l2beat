import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { NoResultsInfo } from '../NoResultsInfo'
import { NonMintingTable } from './tables/NonMintingTable'

export function NonMintingCard({
  entries,
  isLoading,
}: {
  entries: InteropDashboardData['entries'] | undefined
  isLoading: boolean
}) {
  return (
    <PrimaryCard className="flex flex-col max-md:border-divider max-md:border-b">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Non-minting
        </h2>
        <a href="/interop/non-minting">
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
        In-light risk only. Tokens are therefore first bridged using a different
        minting bridge that needs to be separately assessed.
      </div>
      {isLoading && <Skeleton className="mt-2 h-62 w-full rounded-sm" />}
      {entries ? (
        entries.length === 0 ? (
          <NoResultsInfo />
        ) : (
          <NonMintingTable entries={entries} />
        )
      ) : null}
    </PrimaryCard>
  )
}
