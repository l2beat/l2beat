import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import type { ProjectWithRanges } from '@l2beat/dal'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ZkCatalogAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/zk-catalog/ZkCatalogAssetCategoryTvsChart'
import { ZkCatalogBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/zk-catalog/ZkCatalogBridgeTypeTvsChart'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { IncludeRwaRestrictedTokensCheckbox } from '~/pages/scaling/components/IncludeRwaRestrictedTokensCheckbox'
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
          <ZkCatalogBridgeTypeTvsChart
            project={project}
            milestones={milestones}
            projectsForTvs={projectsForTvs}
          />
          <ZkCatalogAssetCategoryTvsChart
            project={project}
            milestones={milestones}
            projectsForTvs={projectsForTvs}
          />
          <div className="flex justify-end">
            <IncludeRwaRestrictedTokensCheckbox />
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
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}) {
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()

  const { data } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range,
    excludeAssociatedTokens: false,
    includeRwaRestrictedTokens,
  })

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
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

function TvsProjectStats({
  tvsInfo,
  projectsForTvs,
}: {
  tvsInfo: ProjectTvsInfo | undefined
  projectsForTvs: ProjectWithRanges[]
}) {
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range: optionToRange('7d'),
    excludeAssociatedTokens: false,
    includeRwaRestrictedTokens,
  })

  const stats = getStats(data)

  return (
    <>
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

  const filteredData = data.chart.filter((dataPoint) =>
    dataPoint.slice(2).every((value) => value !== null),
  ) as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ][]

  const latestValueRecord = filteredData.at(-1)
  const oldestValueRecord = filteredData.at(0)

  if (!latestValueRecord || !oldestValueRecord) {
    return undefined
  }

  const [
    _latestTimestamp,
    _latestEthPrice,
    latestNative,
    latestCanonical,
    latestExternal,
    latestEther,
    latestStablecoin,
    latestBtc,
    latestOther,
  ] = latestValueRecord

  const [
    _oldestTimestamp,
    _oldestEthPrice,
    oldestNative,
    oldestCanonical,
    oldestExternal,
    oldestEther,
    oldestStablecoin,
    oldestBtc,
    oldestOther,
  ] = oldestValueRecord

  const latestTotal = latestNative + latestCanonical + latestExternal
  const oldestTotal = oldestNative + oldestCanonical + oldestExternal

  return {
    breakdown: {
      total: latestTotal,
      native: latestNative,
      canonical: latestCanonical,
      external: latestExternal,
      ether: latestEther,
      stablecoin: latestStablecoin,
      btc: latestBtc,
      other: latestOther,
    },
    change: {
      total: calculatePercentageChange(latestTotal, oldestTotal),
      native: calculatePercentageChange(latestNative, oldestNative),
      canonical: calculatePercentageChange(latestCanonical, oldestCanonical),
      external: calculatePercentageChange(latestExternal, oldestExternal),
      ether: calculatePercentageChange(latestEther, oldestEther),
      stablecoin: calculatePercentageChange(latestStablecoin, oldestStablecoin),
      btc: calculatePercentageChange(latestBtc, oldestBtc),
      other: calculatePercentageChange(latestOther, oldestOther),
    },
  }
}
