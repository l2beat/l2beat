import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import {
  InteropTransfersTable,
  type InteropTransfersTableProps,
} from './InteropTransfersTable'

export interface InteropTransfersSectionProps
  extends ProjectSectionProps,
    InteropTransfersTableProps {}

export function InteropTransfersSection({
  projectId,
  protocolIds,
  apiSelection,
  snapshotTimestamp,
  interopChains,
  ...sectionProps
}: InteropTransfersSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <InteropTransfersTable
        projectId={projectId}
        protocolIds={protocolIds}
        apiSelection={apiSelection}
        snapshotTimestamp={snapshotTimestamp}
        interopChains={interopChains}
      />
    </ProjectSection>
  )
}
