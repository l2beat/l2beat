import { useMemo } from 'react'
import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import { TopNBadge } from '~/pages/interop/summary/components/TopNBadge'
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { TopProtocolsTable } from './TopProtocolsTable'

export function TopProtocolsCard({
  topProtocols,
  isLoading,
}: {
  topProtocols: ProtocolEntry[] | undefined
  isLoading: boolean
}) {
  const { allChains } = useInteropFlows()
  const exploreAllUrl = useMemo(() => {
    const allChainIds = allChains.map((chain) => chain.id)
    return buildInteropUrl('/interop/summary', {
      from: allChainIds,
      to: allChainIds,
    })
  }, [allChains])

  return (
    <PrimaryCard className="flex flex-col border-divider max-md:border-t md:mt-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-heading-20 md:text-heading-24">
              Protocols by volume
            </h2>
            <TopNBadge n={10} />
          </div>
          <div className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
            Last 24 hours
          </div>
        </div>
        <a href={exploreAllUrl}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 px-4 py-[9px] leading-none"
          >
            Explore all
            <ArrowRightIcon className="size-4 fill-current" />
          </Button>
        </a>
      </div>
      {isLoading ? (
        <Skeleton className="mt-4 h-80 w-full rounded-sm" />
      ) : topProtocols && topProtocols.length > 0 ? (
        <TopProtocolsTable protocols={topProtocols} />
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
