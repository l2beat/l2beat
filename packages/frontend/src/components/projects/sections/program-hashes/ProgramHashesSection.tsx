import type { ProjectScalingContractsProgramHash } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { PROGRAM_HASHES_SECTION_INTRO } from '~/pages/zk-catalog/v2/components/zkCatalogUi'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ProgramHashesTable } from './table/ProgramHashesTable'

export type StateValidationProgramHashData = Omit<
  ProjectScalingContractsProgramHash,
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
  programHashes: StateValidationProgramHashData[]
}

export function ProgramHashesSection({
  programHashes,
  ...sectionProps
}: ProgramHashesSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="mb-4 text-paragraph-15 md:mb-6 md:text-paragraph-16">
        {PROGRAM_HASHES_SECTION_INTRO}
      </p>
      <ProgramHashesTable entries={programHashes} />
    </ProjectSection>
  )
}
