import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChartTabs } from '~/pages/layer2s/summary/components/ChartTabs'
import type { DaFlowsProjects } from '~/server/features/data-availability/flows/getDaFlowsProjects'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import type { DaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import {
  DaSummaryThroughputChart,
  type DaSummaryThroughputChartProps,
} from './components/charts/DaSummaryThroughputChart'
import { DaSummaryTvsChart } from './components/charts/DaSummaryTvsChart'
import { DaFlowsCard } from './components/flows/DaFlowsCard'
import { DaSummaryPublicTable } from './components/table/DaSummaryPublicTable'

interface Props extends AppLayoutProps {
  ethereum: DaSummaryEntry | undefined
  tvsProjectIds: DaTvsProjectIds
  throughput: DaSummaryThroughputChartProps | undefined
  daFlows: DaFlowsProjects
}

export function DataAvailabilitySummaryPage({
  ethereum,
  tvsProjectIds,
  throughput,
  daFlows,
  ...props
}: Props) {
  const tvsChart = <DaSummaryTvsChart projectIds={tvsProjectIds} />
  const throughputChart = throughput && (
    <DaSummaryThroughputChart {...throughput} />
  )

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Summary</MainPageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <PrimaryCard>{tvsChart}</PrimaryCard>
            <PrimaryCard>{throughputChart}</PrimaryCard>
          </div>
          <ChartTabs
            className="lg:hidden"
            charts={[tvsChart, throughputChart]}
          />
          <DaFlowsCard daLayer={daFlows.daLayer} projects={daFlows.projects} />
          <PrimaryCard className="max-md:mt-4 md:mt-6">
            <DaSummaryPublicTable items={ethereum ? [ethereum] : []} />
          </PrimaryCard>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
