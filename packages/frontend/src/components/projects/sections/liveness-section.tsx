import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  ...sectionProps
}: LivenessSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-base">
        The chart illustrates how &quot;live&quot; the project&apos;s operators
        are by displaying how frequently they submit transactions of the
        selected type and if these intervals deviate from their typical
        schedule.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        projectId={projectId}
        configuredSubtypes={configuredSubtypes}
      />
    </ProjectSection>
  )
}
