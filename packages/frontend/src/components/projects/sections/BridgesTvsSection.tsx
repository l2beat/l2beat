import type { Milestone } from '@l2beat/config'
import { useState } from 'react'
import { ProjectTokenChart } from '~/components/chart/tvs/ProjectTokenChart'
import { TokenSummaryBox } from '~/components/chart/tvs/TokenSummaryBox'
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
  projectId: string
  milestones: Milestone[]
  defaultRange: TvsChartRange
}

export function BridgesTvsSection({
  projectId,
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
        projectId={projectId}
        defaultRange={defaultRange}
      />
      {tokens && (
        <TokenCombobox
          tokens={tokens}
          setValue={setToken}
          value={token}
          placeholder="Select a token to preview chart"
          className="mt-2"
        />
      )}
      {token && (
        <>
          <TvsChartControlsContextProvider defaultRange={defaultRange}>
            <ProjectTokenChart
              projectId={projectId}
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
