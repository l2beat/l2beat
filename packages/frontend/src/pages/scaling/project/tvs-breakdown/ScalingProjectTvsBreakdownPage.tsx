import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/ProjectStackedTvsChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { RequestTokenBox } from './components/RequestTokenBox'
import { TvsBreakdownPageHeader } from './components/TvsBreakdownPageHeader'
import { TvsBreakdownSummaryBox } from './components/TvsBreakdownSummaryBox'
import { CanonicallyBridgedTable } from './components/tables/CanonicallyBridgedTable'
import { ExternallyBridgedTable } from './components/tables/ExternallyBridgesTable'
import { NativelyMintedTable } from './components/tables/NativelyMintedTable'

interface Props extends AppLayoutProps {
  tvsBreakdownData: ScalingProjectTvsBreakdown
  queryState: DehydratedState
  defaultRange: TvsChartRange
}

export function ScalingProjectTvsBreakdownPage({
  tvsBreakdownData: {
    project,
    icon,
    dataTimestamp,
    breakdown,
    projectTokens,
    project7dData,
  },
  queryState,
  defaultRange,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <div className="smooth-scroll">
            <TvsBreakdownPageHeader
              title={project.name}
              slug={project.slug}
              icon={icon}
              tvsBreakdownTimestamp={dataTimestamp}
            />
            <div className="md:space-y-6">
              <PrimaryCard>
                <ProjectStackedTvsChart
                  projectId={project.id}
                  milestones={project.milestones ?? []}
                  tokens={projectTokens}
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

              {breakdown.canonical.length > 0 && (
                <HighlightablePrimaryCard
                  id="canonical"
                  className="md:scroll-mt-6"
                >
                  <CanonicallyBridgedTable
                    tokens={breakdown.canonical}
                    id="canonical"
                  />
                </HighlightablePrimaryCard>
              )}
              {breakdown.native.length > 0 && (
                <HighlightablePrimaryCard
                  id="native"
                  className="md:scroll-mt-6"
                >
                  <NativelyMintedTable tokens={breakdown.native} id="native" />
                </HighlightablePrimaryCard>
              )}
              {breakdown.external.length > 0 && (
                <HighlightablePrimaryCard
                  id="external"
                  className="md:scroll-mt-6"
                >
                  <ExternallyBridgedTable
                    tokens={breakdown.external}
                    id="external"
                  />
                </HighlightablePrimaryCard>
              )}
            </div>
            <RequestTokenBox />
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
