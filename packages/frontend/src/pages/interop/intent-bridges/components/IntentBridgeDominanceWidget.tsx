import { useQuery } from '@tanstack/react-query'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'
import { IntentBridgeCompareContent } from './comparison/IntentBridgeCompareContent'
import { IntentBridgeDominanceContent } from './IntentBridgeDominanceContent'

export function IntentBridgeDominanceWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <PrimaryCard className="border-divider max-md:border-b md:col-span-2 lg:row-span-10">
      <Tabs
        name="intentBridgesMode"
        defaultValue="dominance"
        variant="highlighted"
      >
        <TabsList className="w-full">
          <TabsTrigger value="dominance">Intent bridge dominance</TabsTrigger>
          <TabsTrigger value="compare">Compare mode</TabsTrigger>
        </TabsList>
        <TabsContent value="dominance" className="mt-2">
          <IntentBridgeDominanceContent
            intentBridges={intentBridges}
            bridgeDominance={data?.bridgeDominance}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="compare" className="mt-2">
          <IntentBridgeCompareContent
            intentBridges={intentBridges}
            bridgeDominance={data?.bridgeDominance}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}
