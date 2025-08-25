import type { Milestone } from '@l2beat/config'
import { useState } from 'react'
import { ProjectTokenChart } from '~/components/chart/tvs/token/ProjectTokenChart'
import { TokenSummaryBox } from '~/components/chart/tvs/token/TokenSummaryBox'
import type { ChartProject } from '~/components/core/chart/Chart'
import { TokenCombobox } from '~/components/TokenCombobox'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ProjectTvsChart } from '../../chart/tvs/ProjectTvsChart'
import { TvsChartControlsContextProvider } from '../../chart/tvs/TvsChartControlsContext'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface BridgesTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  project: ChartProject
  milestones: Milestone[]
  defaultRange: TvsChartRange
}

export function BridgesTvsSection({
  project,
  milestones,
  tokens,
  defaultRange,
  ...sectionProps
}: BridgesTvsSectionProps) {
  const [token, setToken] = useState<ProjectToken>()
  return (
    <ProjectSection {...sectionProps}>
      <ProjectTvsChart
        milestones={milestones}
        project={project}
        defaultRange={defaultRange}
      />
      {tokens && (
        <TokenCombobox
          tokens={tokens}
          setValue={setToken}
          value={token}
          className="mt-2"
        />
      )}
      {token && (
        <>
          <TvsChartControlsContextProvider defaultRange={defaultRange}>
            <ProjectTokenChart
              project={project}
              milestones={milestones}
              token={token}
            />
          </TvsChartControlsContextProvider>
          <TokenSummaryBox token={token} />
        </>
      )}
    </ProjectSection>
  )
}
