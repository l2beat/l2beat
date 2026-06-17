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
  scope,
  apiSelection,
  snapshotTimestamp,
  interopChains,
  ...sectionProps
}: InteropTransfersSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <InteropTransfersTable
        scope={scope}
        apiSelection={apiSelection}
        snapshotTimestamp={snapshotTimestamp}
        interopChains={interopChains}
      />
    </ProjectSection>
  )
}
