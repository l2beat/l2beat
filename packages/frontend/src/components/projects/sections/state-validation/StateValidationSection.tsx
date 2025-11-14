import type { ProjectScalingStateValidation } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { HorizontalSeparator } from '../../../core/HorizontalSeparator'
import { Markdown } from '../../../markdown/Markdown'
import { ProjectSection } from '../ProjectSection'
import type { StateValidationZkProgramHashData } from '../program-hashes/ProgramHashesSection'
import { ZkProgramHashesTable } from '../program-hashes/table/ZkProgramHashesTable'
import type { ProjectSectionProps } from '../types'
import { Category } from './Category'
import { ProverInfo } from './ProverInfo'

export interface StateValidationSectionProps extends ProjectSectionProps {
  diagram: DiagramParams | undefined
  stateValidation: ProjectScalingStateValidation
  proverInfo?: {
    name: string
    icon: string
    href: string
    trustedSetups: TrustedSetupsByProofSystem
  }
  zkProgramHashes?: StateValidationZkProgramHashData[]
}

export function StateValidationSection({
  diagram,
  stateValidation,
  proverInfo,
  zkProgramHashes,
  ...sectionProps
}: StateValidationSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {diagram && (
        <figure className="mt-4 mb-8 text-center">
          <DiagramImage diagram={diagram} />
          <figcaption className="text-secondary text-xs">
            {diagram.caption}
          </figcaption>
        </figure>
      )}
      <div className="flex flex-col gap-6">
        {stateValidation.description && (
          <>
            <Markdown className="text-paragraph-15 md:text-paragraph-16">
              {stateValidation.description}
            </Markdown>
            <HorizontalSeparator />
          </>
        )}
        {stateValidation.categories.map((category) => (
          <Category key={category.title} category={category} />
        ))}
      </div>
      {proverInfo && <ProverInfo proverInfo={proverInfo} />}
      {zkProgramHashes && zkProgramHashes.length > 0 && (
        <div className="mt-4 space-y-2 md:mt-6">
          <div className="flex items-baseline gap-3">
            <h3 className="whitespace-pre text-heading-20">Program Hashes</h3>
            <div className="w-full border-divider border-b-2" />
          </div>
          <ZkProgramHashesTable entries={zkProgramHashes} />
        </div>
      )}
    </ProjectSection>
  )
}
