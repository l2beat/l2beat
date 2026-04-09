import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { FlowsChainsSelector } from './FlowsChainsSelector'
import { FlowsGeneralStats } from './FlowsGeneralStats'
import { FlowsProtocolsSelector } from './FlowsProtocolsSelector'
import { FlowsGraphPanel } from './graph/FlowsGraphPanel'
import { InteropFlowsProvider } from './utils/InteropFlowsContext'

interface FlowsViewProps {
  interopChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}

export function FlowsView({ interopChains, protocols }: FlowsViewProps) {
  return (
    <InteropFlowsProvider chains={interopChains} protocols={protocols}>
      <PrimaryCard className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
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
      </PrimaryCard>
    </InteropFlowsProvider>
  )
}
