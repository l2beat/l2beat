import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { TvsChartControlsContextProvider } from '~/components/chart/tvs/TvsChartControlsContext'
import { SelectedTokenContextProvider } from '~/components/chart/tvs/token/SelectedTokenContext'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChartControls } from '~/components/projects/sections/tvs/ChartControls'
import { TokenChart } from '~/components/projects/sections/tvs/TokenChart'
import { TokensControls } from '~/components/projects/sections/tvs/TokensControls'
import { TvsProjectStats } from '~/components/projects/sections/tvs/TvsProjectStats'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ScalingRwaRestrictedTokensContextProvider } from '../../components/ScalingRwaRestrictedTokensContext'
import { RequestTokenBox } from './components/RequestTokenBox'
import { TvsBreakdownPageHeader } from './components/TvsBreakdownPageHeader'
import { ProjectTvsBreakdownTokenTable } from './components/tables/ProjectTvsBreakdownTokenTable'

interface Props extends AppLayoutProps, ScalingProjectTvsBreakdown {
  defaultRange: TvsChartRange
}

export function ScalingProjectTvsBreakdownPage({
  project,
  icon,
  dataTimestamp,
  entries,
  project7dData,
  milestones,
  defaultRange,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <TvsBreakdownPageHeader
          title={project.name}
          slug={project.slug}
          icon={icon}
          tvsBreakdownTimestamp={dataTimestamp}
        />
        <div
          className="smooth-scroll group/section-wrapper md:space-y-6"
          data-project-page={true}
        >
          <SelectedTokenContextProvider>
            <TvsChartControlsContextProvider defaultRange={defaultRange}>
              <ScalingRwaRestrictedTokensContextProvider>
                <PrimaryCard>
                  <ChartControls projectId={project.id} />
                  <ProjectBridgeTypeTvsChart
                    project={project}
                    milestones={milestones}
                  />
                  <ProjectAssetCategoryTvsChart
                    project={project}
                    milestones={milestones}
                  />
                  <div>
                    <section id="token-chart" className="scroll-mt-2">
                      <TokensControls tokens={entries} />
                      <TokenChart project={project} milestones={milestones} />
                    </section>
                  </div>
                  <TvsProjectStats
                    projectId={project.id}
                    tvsInfo={project.tvsInfo}
                  />
                </PrimaryCard>
              </ScalingRwaRestrictedTokensContextProvider>
            </TvsChartControlsContextProvider>
            <TableFilterContextProvider>
              <ProjectTvsBreakdownTokenTable entries={entries} />
            </TableFilterContextProvider>
          </SelectedTokenContextProvider>
        </div>
        <RequestTokenBox />
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
