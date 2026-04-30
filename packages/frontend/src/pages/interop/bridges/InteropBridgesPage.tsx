import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { BridgeComparisonData } from '~/server/features/scaling/interop/getBridgeComparisonData'
import type {
  ChainCoverageData,
  ChainPair,
  PathSpeedStats,
  TopToken,
  TransferSpeedStats,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { ChainCoverageCards } from '../frameworks/components/ChainCoverageCards'
import { ChainPairsCards } from '../frameworks/components/ChainPairsCards'
import { OverviewCards } from '../frameworks/components/OverviewCards'
import { TopTokensCards } from '../frameworks/components/TopTokensCards'
import { TransferSpeedCards } from '../frameworks/components/TransferSpeedCards'
import { TransferSizeChart } from '../summary/components/charts/TransferSizeChart'

interface Props extends AppLayoutProps, BridgeComparisonData {}

export function InteropBridgesPage({
  frameworks,
  transferSpeed,
  pathSpeed,
  chainCoverage,
  topTokens,
  chainPairs,
  transferSizeChartData,
  chainMap,
  allTrackedChains,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout maxWidth="wide">
        <MainPageHeader>Intent Protocols</MainPageHeader>

        <div className="flex flex-col gap-4 md:mt-5 md:gap-5">
          <OverviewCards frameworks={frameworks} />
          <TransferSpeedCards
            transferSpeed={transferSpeed as unknown as TransferSpeedStats[]}
            pathSpeed={pathSpeed as unknown as PathSpeedStats[]}
            frameworks={frameworks}
            chainMap={chainMap}
          />
          <ChainCoverageCards
            chainCoverage={chainCoverage as unknown as ChainCoverageData[]}
            frameworks={frameworks}
            chainMap={chainMap}
            allTrackedChains={allTrackedChains}
          />
          <TopTokensCards
            topTokens={topTokens as unknown as TopToken[]}
            frameworks={frameworks}
          />
          <PrimaryCard className="flex flex-col">
            <h2 className="font-bold text-heading-20 md:text-heading-24">
              Transfer Size Distribution
              <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
                Last 24h
              </span>
            </h2>
            <TransferSizeChart
              data={transferSizeChartData}
              isLoading={false}
              horizontal
            />
          </PrimaryCard>
          <ChainPairsCards
            chainPairs={chainPairs as unknown as ChainPair[]}
            frameworks={frameworks}
            chainMap={chainMap}
          />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
