import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { FrameworkComparisonData } from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { TransferSizeChart } from '../summary/components/charts/TransferSizeChart'
import { BridgeBreakdown } from './components/BridgeBreakdown'
import { ChainCoverageCards } from './components/ChainCoverageCards'
import { ChainPairsCards } from './components/ChainPairsCards'
import { ComparisonTable } from './components/ComparisonTable'
import { OverviewCards } from './components/OverviewCards'
import { TopTokensCards } from './components/TopTokensCards'
import { TransferSpeedCards } from './components/TransferSpeedCards'

interface Props extends AppLayoutProps, FrameworkComparisonData {}

export function InteropFrameworksPage({
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
        <MainPageHeader
          description={
            <>
              Comparing four major multichain token frameworks covered in{' '}
              <a
                href="https://li.fi/knowledge-hub/comparing-token-frameworks/"
                className="text-link underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LI.FI&apos;s analysis
              </a>
              . Data is sourced from L2BEAT&apos;s interop tracking
              infrastructure. Claims from the original article that cannot be
              verified against our data are marked as{' '}
              <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 font-semibold text-[10px] text-yellow-400 uppercase">
                unverified
              </span>
              .
            </>
          }
        >
          Framework Comparison
        </MainPageHeader>

        <div
          className="flex flex-col gap-4 md:mt-5 md:gap-5"
          data-hide-overflow-x
        >
          <OverviewCards frameworks={frameworks} />
          <TransferSpeedCards
            transferSpeed={transferSpeed}
            pathSpeed={pathSpeed}
            frameworks={frameworks}
            chainMap={chainMap}
          />
          <ChainCoverageCards
            chainCoverage={chainCoverage}
            frameworks={frameworks}
            chainMap={chainMap}
            allTrackedChains={allTrackedChains}
          />
          <TopTokensCards topTokens={topTokens} frameworks={frameworks} />
          <BridgeBreakdown frameworks={frameworks} />
          <PrimaryCard className="flex flex-col">
            <h2 className="font-bold text-heading-20 md:text-heading-24">
              Transfer Size Distribution
              <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
                Last 7d
              </span>
            </h2>
            <TransferSizeChart
              data={transferSizeChartData}
              isLoading={false}
              horizontal
            />
          </PrimaryCard>
          <ChainPairsCards
            chainPairs={chainPairs}
            frameworks={frameworks}
            chainMap={chainMap}
          />
          <ComparisonTable frameworks={frameworks} />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
