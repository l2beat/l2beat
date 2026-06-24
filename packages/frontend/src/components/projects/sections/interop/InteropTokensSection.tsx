import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import {
  InteropTokensTable,
  type InteropTokensTableProps,
} from './InteropTokensTable'

export interface InteropTokensSectionProps
  extends ProjectSectionProps,
    InteropTokensTableProps {}

export function InteropTokensSection({
  projectId,
  apiSelection,
  ...sectionProps
}: InteropTokensSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <InteropTokensTable projectId={projectId} apiSelection={apiSelection} />
    </ProjectSection>
  )
}
