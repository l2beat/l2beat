import { RecentChangesPanel } from '~/components/projects/recent-changes/RecentChangesPanel'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface UpdatesMonitorSectionProps extends ProjectSectionProps {
  projectId: string
}

export function UpdatesMonitorSection({
  projectId,
  ...projectSectionProps
}: UpdatesMonitorSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <RecentChangesPanel projectId={projectId} />
    </ProjectSection>
  )
}
