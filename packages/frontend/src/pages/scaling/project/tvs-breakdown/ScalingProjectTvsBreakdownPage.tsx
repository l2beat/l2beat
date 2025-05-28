import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/project-stacked-tvs-chart'
import { ContentWrapper } from '~/components/content-wrapper'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { HighlightablePrimaryCard } from '~/components/primary-card/highlightable-primary-card'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import type { ScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'
import { RequestTokenBox } from './_components/request-token-box'
import { CanonicallyBridgedTable } from './_components/tables/canonically-bridged-table'
import { ExternallyBridgedTable } from './_components/tables/externally-bridges-table'
import { NativelyMintedTable } from './_components/tables/natively-minted-table'
import { TvsBreakdownPageHeader } from './_components/tvs-breakdown-page-header'
import { TvsBreakdownSummaryBox } from './_components/tvs-breakdown-summary-box'

interface Props extends AppLayoutProps {
  tvsBreakdownData: ScalingProjectTvsBreakdownData
  queryState: DehydratedState
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
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <TopNavLayout>
          <div className="smooth-scroll">
            <ContentWrapper mobileFull className="mx-auto h-full max-w-[928px]">
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
                    <NativelyMintedTable
                      tokens={breakdown.native}
                      id="native"
                    />
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
            </ContentWrapper>
            <ScrollToTopButton />
          </div>
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
