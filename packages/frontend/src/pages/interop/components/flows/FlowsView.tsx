import partition from 'lodash/partition'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CursorClickIcon } from '~/icons/CursorClick'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { MIN_SELECTED_CHAINS, MIN_SELECTED_PROTOCOLS } from './consts'
import { FlowsChainsSelector } from './FlowsChainsSelector'
import { FlowsGeneralStats } from './FlowsGeneralStats'
import { FlowsProtocolsSelector } from './FlowsProtocolsSelector'
import { FlowsGraphPanel } from './graph/FlowsGraphPanel'
import { InactiveChainsDialog } from './graph/InactiveChainsDialog'
import { FlowsSelectedPathPanel } from './selection-panel/FlowsSelectedPathPanel'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from './utils/InteropFlowsContext'

interface FlowsViewProps {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
  defaultSelectedChains: string[]
}

export function FlowsView({
  interopChains,
  protocols,
  defaultSelectedChains,
}: FlowsViewProps) {
  return (
    <InteropFlowsProvider
      chains={interopChains}
      protocols={protocols}
      defaultSelectedChains={defaultSelectedChains}
    >
      <FlowsViewContent interopChains={interopChains} protocols={protocols} />
    </InteropFlowsProvider>
  )
}

function FlowsViewContent({
  interopChains,
  protocols,
}: Omit<FlowsViewProps, 'defaultSelectedChains'>) {
  const { highlightedChains, selectedChains, selectedProtocols } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS
  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
    },
    { enabled: hasEnoughChains && hasEnoughProtocols },
  )
  const activeIds = new Set<string>([
    ...(data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  ])
  const [activeChains, inactiveChains] = partition(
    interopChains.filter((chain) => selectedChains.includes(chain.id)),
    (chain) => activeIds.has(chain.id),
  )

  const visibleHighlightedChains = isLoading
    ? highlightedChains
    : highlightedChains.filter((chainId) => activeIds.has(chainId))
  const hasGraphSelection = visibleHighlightedChains.length > 0
  const shouldRenderInactiveChainsInfo = hasEnoughChains && hasEnoughProtocols
  const shouldShowInactiveChainsInfo =
    !!data && inactiveChains.length > 0 && !isLoading

  return (
    <PrimaryCard
      className={cn(
        'grid grid-cols-1 gap-4 transition-[grid-template-columns] duration-300 ease-in-out motion-reduce:transition-none',
        hasGraphSelection
          ? 'lg:grid-cols-[240px_1fr_280px]'
          : 'lg:grid-cols-[240px_1fr_0px]',
      )}
    >
      <div className="h-full max-lg:order-3">
        <FlowsGeneralStats />
      </div>
      <div className="flex h-full min-w-0 flex-col">
        <div className="group/flows flex h-full w-full min-w-0 flex-col items-center gap-10 pb-4 xl:h-[calc(100svh-12rem)]">
          <div className="flex flex-col items-center gap-3 max-lg:order-1">
            <div className="flex gap-2">
              <FlowsChainsSelector allChains={interopChains} />
              <FlowsProtocolsSelector allProtocols={protocols} />
            </div>
            <SelectInfo
              highlightedChainsNumber={visibleHighlightedChains.length}
            />
          </div>
          <FlowsGraphPanel
            activeChains={activeChains}
            data={data}
            hasEnoughChains={hasEnoughChains}
            hasEnoughProtocols={hasEnoughProtocols}
            isLoading={isLoading}
          />
        </div>
        {shouldRenderInactiveChainsInfo && (
          <div className="mt-3 flex min-h-6 w-full items-center justify-center gap-1 pt-1 max-lg:order-2">
            {shouldShowInactiveChainsInfo ? (
              <>
                <span className="font-normal text-secondary text-xs leading-none md:text-base">
                  No transfers detected for
                </span>
                <InactiveChainsDialog chains={inactiveChains} />
              </>
            ) : isLoading ? (
              <Skeleton className="h-4 w-40 md:h-5" />
            ) : null}
          </div>
        )}
      </div>
      <div
        className={cn(
          'min-w-0 overflow-hidden motion-reduce:transition-none max-lg:order-2 lg:translate-x-3 lg:opacity-0 lg:transition-[transform,opacity] lg:duration-300 lg:ease-out',
          hasGraphSelection && 'lg:translate-x-0 lg:opacity-100',
        )}
      >
        <div className="h-full lg:w-[280px]">
          <FlowsSelectedPathPanel
            visibleHighlightedChains={visibleHighlightedChains}
          />
        </div>
      </div>
    </PrimaryCard>
  )
}

function SelectInfo({
  highlightedChainsNumber,
}: {
  highlightedChainsNumber: number
}) {
  const text =
    highlightedChainsNumber === 1
      ? 'Select second chain to view detailed data'
      : 'Select chain or pair of chains to view detailed data'
  return (
    <div
      className={cn(
        'flex items-center gap-0.5 transition-transform duration-200',
        highlightedChainsNumber === 0 &&
          'group-has-[#flows-graph_svg:hover]/flows:scale-[1.15]',
      )}
    >
      <CursorClickIcon className="size-3 fill-brand md:size-4" />
      <p className="font-medium text-brand text-label-value-13 italic leading-none md:text-label-value-14">
        {text}
      </p>
    </div>
  )
}
