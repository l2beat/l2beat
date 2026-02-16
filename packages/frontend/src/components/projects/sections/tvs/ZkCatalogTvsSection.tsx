import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { ZkCatalogProjectsTvsChart } from '~/components/chart/tvs/stacked/zk-catalog/ZkCatalogProjectsTvsChart'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { ExcludeRwaRestrictedTokensCheckbox } from '~/pages/scaling/components/ExcludeRwaRestrictedTokensCheckbox'
import {
  ScalingRwaRestrictedTokensContextProvider,
  useScalingRwaRestrictedTokensContext,
} from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import {
  TvsBreakdownSummaryBox,
  type TvsData,
} from '~/pages/scaling/project/tvs-breakdown/components/TvsBreakdownSummaryBox'
import type { DetailedTvsChartWithProjectsRangesData } from '~/server/features/scaling/tvs/getDetailedTvsChartWithProjectsRanges'
import { api } from '~/trpc/React'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'
import {
  TvsChartControlsContextProvider,
  useTvsChartControlsContext,
} from '../../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface ZkCatalogTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  project: ChartProject
  milestones: Milestone[]
  tvsInfo: ProjectTvsInfo | undefined
  defaultRange: ChartRange
  projectsForTvs: {
    projectId: ProjectId
    name: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}

export function ZkCatalogTvsSection({
  project,
  milestones,
  tvsInfo,
  defaultRange,
  projectsForTvs,
  ...sectionProps
}: ZkCatalogTvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ScalingRwaRestrictedTokensContextProvider>
        <TvsChartControlsContextProvider defaultRange={defaultRange}>
          <ChartControls projectsForTvs={projectsForTvs} />
          <ZkCatalogProjectsTvsChart
            project={project}
            milestones={milestones}
            projectsForTvs={projectsForTvs}
          />
          <div className="flex justify-end">
            <ExcludeRwaRestrictedTokensCheckbox />
          </div>
          <TvsProjectStats tvsInfo={tvsInfo} projectsForTvs={projectsForTvs} />
        </TvsChartControlsContextProvider>
      </ScalingRwaRestrictedTokensContextProvider>
    </ProjectSection>
  )
}

function ChartControls({
  projectsForTvs,
}: {
  projectsForTvs: {
    projectId: ProjectId
    name: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}) {
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()

  const { data } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens,
  })

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(({ timestamp }) => ({ timestamp })),
      ),
    [data?.chart],
  )
  return (
    <TvsChartControls
      timeRange={timeRange}
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

function ZkCatalogTvsBreakdowns({
  stats,
  isLoading,
}: {
  stats: TvsData | undefined
  isLoading: boolean
}) {
  const latestStats = stats?.breakdown
  if (isLoading || !latestStats) {
    return (
      <div className="mt-6 space-y-6">
        <Skeleton className="h-13 w-full" />
        <Skeleton className="h-13 w-full" />
      </div>
    )
  }
  return (
    <div className="mt-6 space-y-6">
      <BreakdownRow
        title="TVS stacked by bridge type"
        values={[
          {
            label: 'Canonical',
            value: latestStats.canonical,
            className: 'bg-chart-stacked-purple',
          },
          {
            label: 'Native',
            value: latestStats.native,
            className: 'bg-chart-stacked-pink',
          },
          {
            label: 'External',
            value: latestStats.external,
            className: 'bg-chart-stacked-yellow',
          },
        ]}
      />
      <BreakdownRow
        title="TVS stacked by asset category"
        values={[
          {
            label: 'ETH & derivatives',
            value: latestStats.ether,
            className: 'bg-chart-ethereum',
          },
          {
            label: 'Stablecoins',
            value: latestStats.stablecoin,
            className: 'bg-chart-teal',
          },
          {
            label: 'BTC & derivatives',
            value: latestStats.btc,
            className: 'bg-chart-orange',
          },
          {
            label: 'Others',
            value: latestStats.other,
            className: 'bg-chart-yellow-lime',
          },
        ]}
      />
    </div>
  )
}

function BreakdownRow({
  title,
  values,
}: {
  title: string
  values: {
    label: string
    value: number
    className: string
  }[]
}) {
  return (
    <div>
      <h3 className="font-bold text-heading-16 leading-[115%]">{title}</h3>
      <Breakdown className="mt-2! h-2 w-full" gap={0} values={values} />
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {values.map((value) => (
          <div key={value.label} className="flex items-center gap-1">
            <div className={cn('size-3.5 rounded-xs', value.className)} />
            <span className="font-medium text-label-value-12 text-secondary leading-none">
              {value.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TvsProjectStats({
  tvsInfo,
  projectsForTvs,
}: {
  tvsInfo: ProjectTvsInfo | undefined
  projectsForTvs: {
    projectId: ProjectId
    name: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}) {
  const { excludeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range: optionToRange('7d'),
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens,
  })

  const stats = getStats(data)

  return (
    <>
      <ZkCatalogTvsBreakdowns stats={stats} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      <TvsBreakdownSummaryBox
        tvsData={stats}
        isLoading={isLoading}
        warning={tvsInfo?.warnings[0]}
      />
    </>
  )
}

function getStats(
  data: DetailedTvsChartWithProjectsRangesData | undefined,
): TvsData | undefined {
  if (!data) return undefined

  const syncedChart = data.chart.filter(
    (dataPoint) => dataPoint.timestamp <= data.syncedUntil,
  )
  const latestDataPoint = syncedChart.at(-1)
  const oldestDataPoint = syncedChart.at(0)

  if (!latestDataPoint || !oldestDataPoint) {
    return undefined
  }

  const latest = getSummedStats(latestDataPoint.projects)
  const oldest = getSummedStats(oldestDataPoint.projects)

  const latestTotal = latest.total
  const oldestTotal = oldest.total

  return {
    breakdown: {
      total: latestTotal,
      native: latest.native,
      canonical: latest.canonical,
      external: latest.external,
      ether: latest.ether,
      stablecoin: latest.stablecoin,
      btc: latest.btc,
      other: latest.other,
    },
    change: {
      total: calculatePercentageChange(latestTotal, oldestTotal),
      native: calculatePercentageChange(latest.native, oldest.native),
      canonical: calculatePercentageChange(latest.canonical, oldest.canonical),
      external: calculatePercentageChange(latest.external, oldest.external),
      ether: calculatePercentageChange(latest.ether, oldest.ether),
      stablecoin: calculatePercentageChange(
        latest.stablecoin,
        oldest.stablecoin,
      ),
      btc: calculatePercentageChange(latest.btc, oldest.btc),
      other: calculatePercentageChange(latest.other, oldest.other),
    },
  }
}

function getSummedStats(
  projects: DetailedTvsChartWithProjectsRangesData['chart'][number]['projects'],
) {
  return Object.values(projects).reduce(
    (acc, projectData) => {
      if (!projectData) {
        return acc
      }

      acc.total += projectData.value
      acc.native += projectData.native
      acc.canonical += projectData.canonical
      acc.external += projectData.external
      acc.ether += projectData.ether
      acc.stablecoin += projectData.stablecoin
      acc.btc += projectData.btc
      acc.other += projectData.other

      return acc
    },
    {
      total: 0,
      native: 0,
      canonical: 0,
      external: 0,
      ether: 0,
      stablecoin: 0,
      btc: 0,
      other: 0,
    },
  )
}
