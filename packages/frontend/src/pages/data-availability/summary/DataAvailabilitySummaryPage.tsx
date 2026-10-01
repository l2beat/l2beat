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
import { DaFlowsCard } from './components/flows/DaFlowsCard'

interface Props extends AppLayoutProps {
  /** Ethereum's slashable stake */
  slashable: number | undefined
  tvsProjectIds: DaTvsProjectIds
  throughput: DaSummaryThroughputChartProps | undefined
  daFlows: DaFlowsProjects
}

export function DataAvailabilitySummaryPage({
  slashable,
  tvsProjectIds,
  throughput,
  daFlows,
  ...props
}: Props) {
  const tvsChart = (
    <DaSummaryTvsChart projectIds={tvsProjectIds} slashable={slashable} />
  )
  const throughputChart = throughput && (
    <DaSummaryThroughputChart {...throughput} />
  )

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Blobs</MainPageHeader>
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
          <DaFlowsCard daLayer={daFlows.daLayer} projects={daFlows.projects} />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
