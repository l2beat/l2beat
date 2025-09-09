import type { Milestone } from '@l2beat/config'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import {
  TvsChartControlsContextProvider,
  useTvsChartControlsContext,
} from '~/components/chart/tvs/TvsChartControlsContext'
import { ProjectTokenChart } from '~/components/chart/tvs/token/ProjectTokenChart'
import {
  SelectedTokenContextProvider,
  useSelectedTokenContext,
} from '~/components/chart/tvs/token/SelectedTokenContext'
import { TokenSummaryBox } from '~/components/chart/tvs/token/TokenSummaryBox'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { TokenCombobox } from '~/components/TokenCombobox'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ScalingProjectTvsBreakdown } from '~/server/features/scaling/project/getScalingProjectTvsBreakdown'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { RequestTokenBox } from './components/RequestTokenBox'
import { TvsBreakdownPageHeader } from './components/TvsBreakdownPageHeader'
import { TvsBreakdownSummaryBox } from './components/TvsBreakdownSummaryBox'
import { ProjectTvsBreakdownTokenTable } from './components/tables/ProjectTvsBreakdownTokenTable'

interface Props extends AppLayoutProps, ScalingProjectTvsBreakdown {
  queryState: DehydratedState
  defaultRange: TvsChartRange
}

export function ScalingProjectTvsBreakdownPage({
  project,
  icon,
  dataTimestamp,
  entries,
  project7dData,
  milestones,
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
          <div
            className="smooth-scroll group/section-wrapper md:space-y-6"
            data-project-page={true}
          >
            <SelectedTokenContextProvider>
              <PrimaryCard>
                <TvsChartControlsContextProvider defaultRange={defaultRange}>
                  <Controls projectId={project.id} />
                  <ProjectBridgeTypeTvsChart
                    project={project}
                    milestones={milestones}
                  />
                  <ProjectAssetCategoryTvsChart
                    project={project}
                    milestones={milestones}
                  />
                </TvsChartControlsContextProvider>
                <TvsChartControlsContextProvider defaultRange={defaultRange}>
                  <InteractiveTokenChart
                    entries={entries}
                    project={project}
                    milestones={milestones}
                  />
                </TvsChartControlsContextProvider>
                <HorizontalSeparator className="my-4" />
                <TvsBreakdownSummaryBox
                  {...project7dData}
                  warning={project.tvsInfo?.warnings[0]}
                />
              </PrimaryCard>
              <TableFilterContextProvider>
                <ProjectTvsBreakdownTokenTable entries={entries} />
              </TableFilterContextProvider>
            </SelectedTokenContextProvider>
          </div>
          <RequestTokenBox />
          <ScrollToTopButton />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

function InteractiveTokenChart({
  entries,
  project,
  milestones,
}: {
  project: ChartProject
  entries: ProjectToken[]
  milestones: Milestone[]
}) {
  const { selectedToken, setSelectedToken } = useSelectedTokenContext()
  return (
    <section id="token-chart" className="scroll-mt-3">
      <TokenCombobox
        tokens={entries ?? []}
        value={selectedToken}
        setValue={setSelectedToken}
      />

      {selectedToken && (
        <>
          <TokenControls
            token={selectedToken}
            projectId={project.id}
            className="mt-2"
          />
          <ProjectTokenChart
            project={project}
            milestones={milestones}
            token={selectedToken}
          />
          <TokenSummaryBox token={selectedToken} />
        </>
      )}
    </section>
  )
}

function Controls({ projectId }: { projectId: string }) {
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()

  const { data } = api.tvs.detailedChart.useQuery({
    filter: { type: 'projects', projectIds: [projectId] },
    range,
    excludeAssociatedTokens: false,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data?.chart],
  )

  return (
    <TvsChartControls
      chartRange={chartRange}
      range={{
        value: range,
        setValue: setRange,
      }}
      unit={{
        value: unit,
        setValue: setUnit,
      }}
    />
  )
}

function TokenControls({
  token,
  projectId,
  className,
}: {
  token: ProjectToken
  projectId: string
  className?: string
}) {
  const { range, setRange } = useTvsChartControlsContext()
  const { data } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId,
    },
    range,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data?.chart],
  )
  return (
    <TvsChartControls
      className={className}
      chartRange={chartRange}
      range={{
        value: range,
        setValue: setRange,
      }}
    />
  )
}
