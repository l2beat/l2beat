import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { SelectedTokenContextProvider } from '~/components/chart/tvs/token/SelectedTokenContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { Layer2sRwaRestrictedTokensContextProvider } from '~/pages/layer2s/components/Layer2sRwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'
import type { ChartRange } from '~/utils/range/range'
import { TvsChartControlsContextProvider } from '../../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ChartControls } from './ChartControls'
import { TokenChart } from './TokenChart'
import { TokensControls } from './TokensControls'
import { TvsBreakdownButton } from './TvsBreakdownButton'
import { TvsProjectStats } from './TvsProjectStats'

export interface Layer2sTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  project: ChartProject
  milestones: Milestone[]
  tvsInfo: ProjectTvsInfo
  tvsBreakdownUrl?: string
  defaultRange: ChartRange
}

export function Layer2sTvsSection({
  project,
  milestones,
  tokens,
  tvsInfo,
  tvsBreakdownUrl,
  defaultRange,
  ...sectionProps
}: Layer2sTvsSectionProps) {
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
      <Layer2sRwaRestrictedTokensContextProvider>
        <TvsChartControlsContextProvider defaultRange={defaultRange}>
          <SelectedTokenContextProvider>
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
              <TokensControls tokens={tokens} />
              <TokenChart project={project} milestones={milestones} />
            </div>
            <TvsProjectStats
              projectId={project.id}
              tvsBreakdownUrl={tvsBreakdownUrl}
              tvsInfo={tvsInfo}
            />
          </SelectedTokenContextProvider>
        </TvsChartControlsContextProvider>
      </Layer2sRwaRestrictedTokensContextProvider>
    </ProjectSection>
  )
}
