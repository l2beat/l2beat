import type { ProjectScalingStateValidation } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import type { TrustedSetupsByProofSystem } from '~/server/features/zk-catalog/utils/getTrustedSetupsWithVerifiersAndAttesters'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { HorizontalSeparator } from '../../../core/HorizontalSeparator'
import { Markdown } from '../../../markdown/Markdown'
import { ProjectSection } from '../ProjectSection'
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
}

export function StateValidationSection({
  diagram,
  stateValidation,
  proverInfo,
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
    </ProjectSection>
  )
}
