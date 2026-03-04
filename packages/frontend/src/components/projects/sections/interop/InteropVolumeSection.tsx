import type { ProjectId } from '@l2beat/shared-pure'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface InteropVolumeSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

export function InteropVolumeSection({
  projectId,
  ...sectionProps
}: InteropVolumeSectionProps) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...selectionForApi,
    id: projectId,
  })

  return <ProjectSection {...sectionProps}>teste</ProjectSection>
}
