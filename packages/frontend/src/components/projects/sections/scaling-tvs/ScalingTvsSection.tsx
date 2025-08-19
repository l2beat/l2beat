import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import capitalize from 'lodash/capitalize'
import { useMemo, useState } from 'react'
import { ProjectTokenChart2 } from '~/components/chart/tvs/ProjectTokenChart2'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { TvsChartTimeRangeControls } from '~/components/chart/tvs/TvsChartTimeRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TokenCombobox } from '~/components/TokenCombobox'
import { TvsBreakdownSummaryBox } from '~/pages/scaling/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import { categoryToLabel } from '~/pages/scaling/project/tvs-breakdown/components/tables/categoryToLabel'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import {
  ScalingTvsChartControlsContextProvider,
  useScalingTvsChartControlsContext,
} from './ScalingTvsControlsContext'

export interface ScalingTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  projectId: string
  milestones: Milestone[]
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvsInfo: ProjectTvsInfo
  tvsBreakdownUrl?: string
  defaultRange: TvsChartRange
}

export function ScalingTvsSection({
  projectId,
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
          <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
        )
      }
    >
      <ScalingTvsChartControlsContextProvider defaultRange={defaultRange}>
        <Controls projectId={projectId} />
        <ProjectBridgeTypeTvsChart
          projectId={projectId}
          milestones={milestones}
        />
        <ProjectAssetCategoryTvsChart
          milestones={milestones}
          projectId={projectId}
        />
        <TokenCombobox
          tokens={tokens ?? []}
          value={selectedToken}
          setValue={setSelectedToken}
          placeholder="Select a token to preview chart"
        />
        {selectedToken && (
          <>
            <ProjectTokenChart2
              projectId={projectId}
              milestones={milestones}
              token={selectedToken}
            />
            <ChartStats className="mt-3">
              <ChartStatsItem label="Value">
                {formatCurrency(selectedToken.value, 'usd')}
              </ChartStatsItem>
              <ChartStatsItem label="Amount">
                {formatCurrency(selectedToken.amount, selectedToken.symbol)}
              </ChartStatsItem>
              <ChartStatsItem label="Bridging Type">
                {capitalize(selectedToken.source)}
              </ChartStatsItem>
              <ChartStatsItem label="Category">
                {categoryToLabel(selectedToken.category)}
              </ChartStatsItem>
            </ChartStats>
          </>
        )}
      </ScalingTvsChartControlsContextProvider>
      {tvsProjectStats && (
        <>
          <HorizontalSeparator className="my-4" />
          <TvsBreakdownSummaryBox
            total={{
              value: tvsProjectStats.breakdown.total,
              change: tvsProjectStats.change.total,
            }}
            canonical={{
              value: tvsProjectStats.breakdown.canonical,
              change: tvsProjectStats.change.canonical,
            }}
            external={{
              value: tvsProjectStats.breakdown.external,
              change: tvsProjectStats.change.external,
            }}
            native={{
              value: tvsProjectStats.breakdown.native,
              change: tvsProjectStats.change.native,
            }}
            warning={tvsInfo?.warnings[0]}
          />
          {tvsBreakdownUrl && (
            <div className="w-full md:hidden">
              <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
            </div>
          )}
        </>
      )}
    </ProjectSection>
  )
}

function Controls({ projectId }: { projectId: string }) {
  const { range, unit, setUnit, setRange } = useScalingTvsChartControlsContext()
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
    <ChartControlsWrapper className="flex-wrap gap-y-0">
      <ProjectChartTimeRange range={chartRange} />
      <div className="flex items-center gap-1">
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={range}
          setTimeRange={setRange}
        />
      </div>
    </ChartControlsWrapper>
  )
}

export function TvsBreakdownButton({
  tvsBreakdownUrl,
}: {
  tvsBreakdownUrl: string
}) {
  return (
    <a
      href={tvsBreakdownUrl}
      className={cn(
        'font-bold text-primary text-xs leading-none md:text-white',
        'flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-linear-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
    >
      View TVS breakdown
    </a>
  )
}
