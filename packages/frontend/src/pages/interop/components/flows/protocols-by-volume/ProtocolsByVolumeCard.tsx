import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { NoResultsInfo } from '~/pages/interop/summary/components/NoResultsInfo'
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import { useTRPC } from '~/trpc/React'
import { describeChainScope } from '../utils/describeChainScope'
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
    <PrimaryCard className="flex flex-col border-divider max-md:border-t md:mt-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
            Protocols by volume
          </h2>
          <div className="mt-1 font-normal text-label-value-13 text-secondary leading-4">
            Last 24h ·{' '}
            {describeChainScope(selectedChains.length, allChains.length)}
          </div>
        </div>
        <a
          href={exploreAllUrl}
          className="shrink-0 whitespace-nowrap font-medium text-label-value-13 text-secondary underline decoration-divider underline-offset-[0.3em] transition-colors hover:text-primary hover:decoration-current"
        >
          View details
        </a>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="mt-4 h-8 w-[110px] rounded-sm" />
          <Skeleton className="mt-4 h-80 w-full rounded-sm" />
        </>
      ) : protocolsByVolume && protocolsByVolume.length > 0 ? (
        <ProtocolsByVolumeTable
          protocols={protocolsByVolume.filter(filterEntries)}
          selectedChains={selectedChains}
          filters={<TableFilters entries={protocolsByVolume} />}
        />
      ) : (
        <NoResultsInfo />
      )}
    </PrimaryCard>
  )
}
