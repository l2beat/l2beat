import type { ProjectScalingContractsProgramHash } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
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
        List of known guest zkVM programs used by this prover. Each program
        represents a piece of offchain execution that is verified onchain. The
        program hash serves as the program's unique identifier.
      </p>
      <ProgramHashesTable entries={programHashes} />
    </ProjectSection>
  )
}
