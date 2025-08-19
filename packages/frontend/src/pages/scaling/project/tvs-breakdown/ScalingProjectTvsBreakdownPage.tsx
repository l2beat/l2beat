import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { RequestTokenBox } from './components/RequestTokenBox'
import { TvsBreakdownPageHeader } from './components/TvsBreakdownPageHeader'
import { TvsBreakdownSummaryBox } from './components/TvsBreakdownSummaryBox'
import { TvsBreakdownTokenTable } from './components/tables/TvsBreakdownTokenTable'

interface Props extends AppLayoutProps {
  tvsBreakdownData: ScalingProjectTvsBreakdown
  queryState: DehydratedState
  defaultRange: TvsChartRange
}

export function ScalingProjectTvsBreakdownPage({
  tvsBreakdownData: { project, icon, dataTimestamp, entries, project7dData },
  queryState,
  defaultRange,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <TvsBreakdownPageHeader
            title={project.name}
            slug={project.slug}
            icon={icon}
            tvsBreakdownTimestamp={dataTimestamp}
          />
          <div className="md:space-y-6">
            <PrimaryCard>
              <ProjectBridgeTypeTvsChart
                projectId={project.id}
                milestones={project.milestones ?? []}
                tokens={entries}
                defaultRange={defaultRange}
              />
              <HorizontalSeparator className="my-4" />
              <TvsBreakdownSummaryBox
                total={{
                  value: project7dData.breakdown.total,
                  change: project7dData.change.total,
                }}
                canonical={{
                  value: project7dData.breakdown.canonical,
                  change: project7dData.change.canonical,
                }}
                external={{
                  value: project7dData.breakdown.external,
                  change: project7dData.change.external,
                }}
                native={{
                  value: project7dData.breakdown.native,
                  change: project7dData.change.native,
                }}
                warning={project.tvsInfo?.warnings[0]}
              />
            </PrimaryCard>
            <TableFilterContextProvider>
              <TvsBreakdownTokenTable entries={entries} />
            </TableFilterContextProvider>
          </div>
          <RequestTokenBox />
          <ScrollToTopButton />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
