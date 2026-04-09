import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { FlowsChainsSelector } from './FlowsChainsSelector'
import { FlowsGeneralStats } from './FlowsGeneralStats'
import { FlowsProtocolsSelector } from './FlowsProtocolsSelector'
import { FlowsSelectedPathPanel } from './FlowsSelectedPathPanel'
import { FlowsGraphPanel } from './graph/FlowsGraphPanel'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from './utils/InteropFlowsContext'

interface FlowsViewProps {
  interopChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
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
        'grid grid-cols-1',
        hasGraphSelection
          ? 'lg:grid-cols-[240px_1fr_280px]'
          : 'lg:grid-cols-[240px_1fr]',
      )}
    >
      <div className="h-full max-lg:order-2">
        <FlowsGeneralStats />
      </div>
      <div className="mx-auto flex flex-col items-center gap-10">
        <div className="flex gap-2 max-lg:order-1">
          <FlowsChainsSelector allChains={interopChains} />
          <FlowsProtocolsSelector allProtocols={protocols} />
        </div>
        <FlowsGraphPanel interopChains={interopChains} />
      </div>
      {hasGraphSelection && (
        <div className="h-full max-lg:order-3">
          <FlowsSelectedPathPanel />
        </div>
      )}
    </PrimaryCard>
  )
}
