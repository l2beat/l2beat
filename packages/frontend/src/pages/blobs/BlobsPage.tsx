import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChartTabs } from '~/pages/layer2s/summary/components/ChartTabs'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { DaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import {
  BlobsThroughputChart,
  type BlobsThroughputChartProps,
} from './components/charts/BlobsThroughputChart'
import { BlobsTvsChart } from './components/charts/BlobsTvsChart'
import {
  type EthereumSummary,
  EthereumSummaryCard,
} from './components/EthereumSummaryCard'
import { LiveBlobsCard } from './components/live-blobs/LiveBlobsCard'
import { useBlockLimits } from './components/live-blobs/useBlockLimits'

interface Props extends AppLayoutProps {
  ethereumSummary: EthereumSummary
  tvsProjectIds: DaTvsProjectIds
  throughput: BlobsThroughputChartProps
  /** The projects whose batches the live blocks tell apart */
  blobPosters: BlobPoster[]
}

export function BlobsPage({
  ethereumSummary,
  tvsProjectIds,
  throughput,
  blobPosters,
  ...props
}: Props) {
  const tvsChart = <BlobsTvsChart projectIds={tvsProjectIds} />
  const throughputChart = <BlobsThroughputChart {...throughput} />
  const limits = useBlockLimits(throughput.configuredThroughputs)

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Blobs</MainPageHeader>
        {/* On mobile the sections run edge to edge, split by a line */}
        <div className="flex flex-col md:gap-6 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
          <EthereumSummaryCard summary={ethereumSummary} />
          {/* The cards share their rows, so both charts start level however
              tall either header is */}
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <PrimaryCard className="row-span-2 grid grid-rows-subgrid">
              {tvsChart}
            </PrimaryCard>
            <PrimaryCard className="row-span-2 grid grid-rows-subgrid">
              {throughputChart}
            </PrimaryCard>
          </div>
          <ChartTabs
            className="lg:hidden"
            charts={[tvsChart, throughputChart]}
          />
          <LiveBlobsCard projects={blobPosters} limits={limits} />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
