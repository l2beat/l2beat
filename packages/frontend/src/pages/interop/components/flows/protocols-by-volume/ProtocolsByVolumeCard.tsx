import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import { useTRPC } from '~/trpc/React'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { ProtocolsByVolumeTable } from './ProtocolsByVolumeTable'

export function ProtocolsByVolumeCard({ isEnabled }: { isEnabled: boolean }) {
  const trpc = useTRPC()
  const filterEntries = useFilterEntries()
  const { allChains, selectedChains, selectedProtocols } = useInteropFlows()
  const { data: protocolsByVolume, isLoading } = useQuery(
    trpc.interop.protocolsByVolume.queryOptions(
      {
        chains: selectedChains,
        protocolIds: selectedProtocols,
      },
      { enabled: isEnabled },
    ),
  )
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
          <h2 className="font-bold text-heading-20 md:text-heading-24">
            Protocols by volume
          </h2>
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
        <>
          <Skeleton className="mt-4 h-8 w-[110px] rounded-sm" />
          <Skeleton className="mt-4 h-80 w-full rounded-sm" />
        </>
      ) : protocolsByVolume && protocolsByVolume.length > 0 ? (
        <>
          <TableFilters entries={protocolsByVolume} className="mt-4" />
          <ProtocolsByVolumeTable
            protocols={protocolsByVolume.filter(filterEntries)}
            selectedChains={selectedChains}
          />
        </>
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
