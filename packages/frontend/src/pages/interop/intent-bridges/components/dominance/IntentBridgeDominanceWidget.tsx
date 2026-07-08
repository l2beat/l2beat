import { useQuery } from '@tanstack/react-query'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import { useChainSetSelection } from '../../../components/chain-selector/ChainSetSelectionContext'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import { IntentBridgeCompareContent } from '../comparison/IntentBridgeCompareContent'
import { IntentBridgeDominanceContent } from './IntentBridgeDominanceContent'

export function IntentBridgeDominanceWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useChainSetSelection()

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <PrimaryCard className="border-divider max-md:border-b">
      <Tabs
        name="intentBridgesMode"
        defaultValue="dominance"
        variant="highlighted"
      >
        <TabsList className="w-full">
          <TabsTrigger value="dominance">Bridge Dominance</TabsTrigger>
          <TabsTrigger value="compare">Compare Mode</TabsTrigger>
        </TabsList>
        {/* Both tabs share one fixed height on desktop so switching modes
            never shifts the page layout; the dominance list scrolls inside. */}
        <TabsContent value="dominance" className="mt-2 lg:h-188 lg:flex-none">
          <IntentBridgeDominanceContent
            intentBridges={intentBridges}
            data={data}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="compare" className="mt-2 lg:h-188 lg:flex-none">
          <IntentBridgeCompareContent
            intentBridges={intentBridges}
            data={data}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}
