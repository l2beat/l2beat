import type { Milestone, ProjectTvsInfo } from '@l2beat/config'
import { ProjectAssetCategoryTvsChart } from '~/components/chart/tvs/stacked/ProjectAssetCategoryTvsChart'
import { ProjectBridgeTypeTvsChart } from '~/components/chart/tvs/stacked/ProjectBridgeTypeTvsChart'
import { SelectedTokenContextProvider } from '~/components/chart/tvs/token/SelectedTokenContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { CompareProjectsLink } from '~/pages/scaling/compare/components/CompareProjectsLink'
import { ScalingRwaRestrictedTokensContextProvider } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { ChartRange } from '~/utils/range/range'
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
  /** Entry to the compare page with this project pre-selected. */
  compareUrl?: string
  defaultRange: ChartRange
}

export function ScalingTvsSection({
  project,
  milestones,
  tokens,
  tvsInfo,
  tvsBreakdownUrl,
  compareUrl,
  defaultRange,
  ...sectionProps
}: ScalingTvsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      headerAccessory={
        <div className="flex items-center gap-2 max-md:hidden">
          {compareUrl && (
            <CompareProjectsLink variant="section" href={compareUrl}>
              Compare
            </CompareProjectsLink>
          )}
          {tvsBreakdownUrl && (
            <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
          )}
        </div>
      }
    >
      <ScalingRwaRestrictedTokensContextProvider>
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
            {compareUrl && (
              <CompareProjectsLink
                variant="section"
                href={compareUrl}
                className="mt-3 md:hidden"
              >
                Compare with other projects
              </CompareProjectsLink>
            )}
          </SelectedTokenContextProvider>
        </TvsChartControlsContextProvider>
      </ScalingRwaRestrictedTokensContextProvider>
    </ProjectSection>
  )
}
