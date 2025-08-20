import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ProjectTokenChart } from '~/components/chart/tvs/ProjectTokenChart'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { TokenSummaryBox } from '~/components/chart/tvs/TokenSummaryBox'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import {
  TvsChartControlsContextProvider,
  useTvsChartControlsContext,
} from '~/components/chart/tvs/TvsChartControlsContext'
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
import { TvsBreakdownTokenTable } from './components/tables/TvsBreakdownTokenTable'

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
  const [selectedToken, setSelectedToken] = useState<ProjectToken>()

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
              <TvsChartControlsContextProvider defaultRange={defaultRange}>
                <Controls projectId={project.id} />
                <ProjectBridgeTypeTvsChart
                  projectId={project.id}
                  milestones={milestones}
                />
                <ProjectAssetCategoryTvsChart
                  projectId={project.id}
                  milestones={milestones}
                />
              </TvsChartControlsContextProvider>
              <TvsChartControlsContextProvider defaultRange={defaultRange}>
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
                      projectId={project.id}
                      milestones={milestones}
                      token={selectedToken}
                    />
                    <TokenSummaryBox token={selectedToken} />
                  </>
                )}
              </TvsChartControlsContextProvider>
              <HorizontalSeparator className="my-4" />
              <TvsBreakdownSummaryBox
                {...project7dData}
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
