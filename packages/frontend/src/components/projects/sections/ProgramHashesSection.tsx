import { ProjectSection } from './ProjectSection'
import {
  type StateValidationZkProgramHashData,
  ZkProgramHash,
} from './state-validation/ZkProgramHash'
import type { ProjectSectionProps } from './types'

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
        {zkProgramHashes.map((zkProgramHash) => (
          <ZkProgramHash
            key={zkProgramHash.hash}
            zkProgramHash={zkProgramHash}
          />
        ))}
      </div>
    </ProjectSection>
  )
}
