import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import { useState } from 'react'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ScalingRwaRestrictedTokensContextProvider } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { TvsChartControlsContextProvider } from '../../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ChartControls } from './ChartControls'
import { TokenChart } from './TokenChart'
import { TokensControls } from './TokensControls'
import { TvsBreakdownButton } from './TvsBreakdownButton'
import { TvsProjectStats } from './TvsProjectStats'

export interface ScalingTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  project: ChartProject
  milestones: Milestone[]
  tvsInfo: ProjectTvsInfo
  tvsBreakdownUrl?: string
  defaultRange: TvsChartRange
}

export function ScalingTvsSection({
  project,
  milestones,
  tokens,
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
      <ScalingRwaRestrictedTokensContextProvider>
        <TvsChartControlsContextProvider defaultRange={defaultRange}>
          <ChartControls projectId={project.id} />
          <ProjectBridgeTypeTvsChart
            project={project}
            milestones={milestones}
          />
          <ProjectAssetCategoryTvsChart
            project={project}
            milestones={milestones}
          />
          <div>
            <TokensControls
              tokens={tokens}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
            />
            <TokenChart
              token={selectedToken}
              project={project}
              milestones={milestones}
            />
          </div>
          <TvsProjectStats
            projectId={project.id}
            tvsBreakdownUrl={tvsBreakdownUrl}
            tvsInfo={tvsInfo}
          />
        </TvsChartControlsContextProvider>
      </ScalingRwaRestrictedTokensContextProvider>
    </ProjectSection>
  )
}
