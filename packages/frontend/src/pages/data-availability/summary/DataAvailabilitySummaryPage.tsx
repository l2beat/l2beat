import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChartTabs } from '~/pages/layer2s/summary/components/ChartTabs'
import type { DaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import type { DaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import {
  DaSummaryThroughputChart,
  type DaSummaryThroughputChartProps,
} from './components/charts/DaSummaryThroughputChart'
import { DaSummaryTvsChart } from './components/charts/DaSummaryTvsChart'
import {
  type EthereumSummary,
  EthereumSummaryCard,
} from './components/EthereumSummaryCard'
import { BlobLab } from './components/flows/lab/BlobLab'
import { getBlockLimits } from './components/flows/lab/model'

interface Props extends AppLayoutProps {
  ethereumSummary: EthereumSummary
  tvsProjectIds: DaTvsProjectIds
  throughput: DaSummaryThroughputChartProps
  daFlows: DaFlowsProjects
}

export function DataAvailabilitySummaryPage({
  ethereumSummary,
  tvsProjectIds,
  throughput,
  daFlows,
  ...props
}: Props) {
  const tvsChart = <DaSummaryTvsChart projectIds={tvsProjectIds} />
  const throughputChart = <DaSummaryThroughputChart {...throughput} />

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Blobs</MainPageHeader>
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
          <BlobLab
            daLayer={daFlows.daLayer}
            projects={daFlows.projects}
            detailsHref={throughput.detailsHref}
            limits={getBlockLimits(throughput.configuredThroughputs)}
          />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
