import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'
import { FrameworkCompareContent } from './comparison/FrameworkCompareContent'
import { FrameworkDominanceContent } from './FrameworkDominanceContent'

export function FrameworkDominanceWidget({
  tokenFrameworks,
}: {
  tokenFrameworks: InteropTokenFramework[]
}) {
  const { selectedChains } = useTokenFrameworksSelectedChains()

  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  return (
    <PrimaryCard className="border-divider max-md:border-b md:col-span-2 lg:row-span-10">
      <Tabs
        name="tokenFrameworksMode"
        defaultValue="dominance"
        variant="highlighted"
      >
        <TabsList className="w-full">
          <TabsTrigger value="dominance">Framework Dominance</TabsTrigger>
          <TabsTrigger value="compare">Compare Mode</TabsTrigger>
        </TabsList>
        <TabsContent value="dominance" className="mt-2">
          <FrameworkDominanceContent
            tokenFrameworks={tokenFrameworks}
            frameworkDominance={data?.frameworkDominance}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="compare" className="mt-2">
          <FrameworkCompareContent
            tokenFrameworks={tokenFrameworks}
            frameworkDominance={data?.frameworkDominance}
            frameworkTable={data?.frameworkTable}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}
