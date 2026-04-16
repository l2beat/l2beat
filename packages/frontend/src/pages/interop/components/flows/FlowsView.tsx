import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CursorClickIcon } from '~/icons/CursorClick'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { FlowsChainsSelector } from './FlowsChainsSelector'
import { FlowsGeneralStats } from './FlowsGeneralStats'
import { FlowsProtocolsSelector } from './FlowsProtocolsSelector'
import { FlowsGraphPanel } from './graph/FlowsGraphPanel'
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
}

export function FlowsView({ interopChains, protocols }: FlowsViewProps) {
  return (
    <InteropFlowsProvider chains={interopChains} protocols={protocols}>
      <FlowsViewContent interopChains={interopChains} protocols={protocols} />
    </InteropFlowsProvider>
  )
}

function FlowsViewContent({ interopChains, protocols }: FlowsViewProps) {
  const { highlightedChains } = useInteropFlows()
  const hasGraphSelection = highlightedChains.length > 0

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
      <div className="group/flows flex w-full min-w-0 flex-col items-center gap-10 md:max-lg:max-h-[70vh] lg:h-[calc(100svh-12rem)]">
        <div className="flex flex-col items-center gap-3 max-lg:order-1">
          <div className="flex gap-2">
            <FlowsChainsSelector allChains={interopChains} />
            <FlowsProtocolsSelector allProtocols={protocols} />
          </div>
          <SelectInfo highlightedChainsNumber={highlightedChains.length} />
        </div>
        <FlowsGraphPanel interopChains={interopChains} />
      </div>
      <div
        className={cn(
          'min-w-0 overflow-hidden motion-reduce:transition-none max-lg:order-2 lg:translate-x-3 lg:opacity-0 lg:transition-[transform,opacity] lg:duration-300 lg:ease-out',
          hasGraphSelection && 'lg:translate-x-0 lg:opacity-100',
        )}
      >
        <div className="h-full lg:w-[280px]">
          <FlowsSelectedPathPanel />
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
