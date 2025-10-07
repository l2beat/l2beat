import type { ProjectScalingContractsZkProgramHash } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ZkProgramHashesTable } from './table/ZkProgramHashesTable'

export type StateValidationZkProgramHashData = Omit<
  ProjectScalingContractsZkProgramHash,
  'proverSystemProject'
> & {
  zkCatalogProject?: {
    name: string
    href: string
    icon: string
  }
  usedIn: UsedInProjectWithIcon[]
}

export interface ProgramHashesSectionProps extends ProjectSectionProps {
  zkProgramHashes: StateValidationZkProgramHashData[]
}

export function ProgramHashesSection({
  zkProgramHashes,
  ...sectionProps
}: ProgramHashesSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        A short description what to expect in this section.
      </p>
      <div className="mt-4 space-y-2 md:mt-6">
        <ZkProgramHashesTable entries={zkProgramHashes} />
      </div>
    </ProjectSection>
  )
}
