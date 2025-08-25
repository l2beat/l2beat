import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { ProjectTokenChart } from '~/components/chart/tvs/token/ProjectTokenChart'
import { TokenSummaryBox } from '~/components/chart/tvs/token/TokenSummaryBox'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TokenCombobox } from '~/components/TokenCombobox'
import { TvsBreakdownSummaryBox } from '~/pages/scaling/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { TvsChartControls } from '../../chart/tvs/TvsChartControls'
import {
  TvsChartControlsContextProvider,
  useTvsChartControlsContext,
} from '../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ScalingTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  project: ChartProject
  milestones: Milestone[]
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvsInfo: ProjectTvsInfo
  tvsBreakdownUrl?: string
  defaultRange: TvsChartRange
}

export function ScalingTvsSection({
  project,
  milestones,
  tokens,
  tvsProjectStats,
  tvsInfo,
  tvsBreakdownUrl,
  defaultRange,
  ...sectionProps
}: ScalingTvsSectionProps) {
  const [selectedToken, setSelectedToken] = useState<ProjectToken | undefined>(
    undefined,
  )
  return (
    <ProjectSection
      {...sectionProps}
      headerAccessory={
        tvsBreakdownUrl && (
          <TvsBreakdownButton
            tvsBreakdownUrl={tvsBreakdownUrl}
            className="max-md:hidden"
          />
        )
      }
    >
      <TvsChartControlsContextProvider defaultRange={defaultRange}>
        <Controls projectId={project.id} />
        <ProjectBridgeTypeTvsChart project={project} milestones={milestones} />
        <ProjectAssetCategoryTvsChart
          project={project}
          milestones={milestones}
        />
      </TvsChartControlsContextProvider>
      <TvsChartControlsContextProvider defaultRange={defaultRange}>
        <TokenCombobox
          tokens={tokens ?? []}
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
      </TvsChartControlsContextProvider>
      {tvsProjectStats && (
        <>
          <HorizontalSeparator className="my-4" />
          <TvsBreakdownSummaryBox
            {...tvsProjectStats}
            warning={tvsInfo?.warnings[0]}
          />
          {tvsBreakdownUrl && (
            <div className="mt-3 w-full md:hidden">
              <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
            </div>
          )}
        </>
      )}
    </ProjectSection>
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

export function TvsBreakdownButton({
  tvsBreakdownUrl,
  className,
}: {
  tvsBreakdownUrl: string
  className?: string
}) {
  return (
    <a
      href={tvsBreakdownUrl}
      className={cn(
        'font-bold text-primary text-xs leading-none md:text-white',
        'flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-linear-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
        className,
      )}
    >
      View TVS breakdown
    </a>
  )
}
