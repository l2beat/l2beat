import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ZkCatalogAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/zk-catalog/ZkCatalogAssetCategoryTvsChart'
import { ZkCatalogBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/zk-catalog/ZkCatalogBridgeTypeTvsChart'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import type { ChartProject } from '~/components/core/chart/Chart'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import {
  ScalingRwaRestrictedTokensContextProvider,
  useScalingRwaRestrictedTokensContext,
} from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import {
  TvsChartControlsContextProvider,
  useTvsChartControlsContext,
} from '../../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { TvsProjectStats } from './TvsProjectStats'

export interface ZkCatalogTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  project: ChartProject
  milestones: Milestone[]
  tvsInfo: ProjectTvsInfo | undefined
  defaultRange: TvsChartRange
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
          <TvsProjectStats
            projectId={project.id}
            tvsBreakdownUrl={undefined}
            tvsInfo={tvsInfo}
          />
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
