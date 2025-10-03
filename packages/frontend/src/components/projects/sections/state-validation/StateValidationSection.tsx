import type { ProjectScalingStateValidation } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import {
  ProjectDetailsRelatedProjectBanner,
  type ProjectDetailsRelatedProjectBannerProps,
} from '~/components/ProjectDetailsRelatedProjectBanner'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { HorizontalSeparator } from '../../../core/HorizontalSeparator'
import { Markdown } from '../../../markdown/Markdown'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { Category } from './Category'
import {
  type StateValidationZkProgramHashData,
  ZkProgramHash,
} from './ZkProgramHash'

export interface StateValidationSectionProps extends ProjectSectionProps {
  diagram: DiagramParams | undefined
  stateValidation: ProjectScalingStateValidation
  zkCatalogBanner?: ProjectDetailsRelatedProjectBannerProps
  zkProgramHashes?: StateValidationZkProgramHashData[]
}

export function StateValidationSection({
  diagram,
  stateValidation,
  zkCatalogBanner,
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
      {zkCatalogBanner && (
        <ProjectDetailsRelatedProjectBanner
          className="mt-4 md:mt-6"
          {...zkCatalogBanner}
        />
      )}
      {zkProgramHashes && (
        <div className="mt-4 space-y-2 md:mt-6">
          {zkProgramHashes.map((zkProgramHash) => (
            <ZkProgramHash
              key={zkProgramHash.hash}
              zkProgramHash={zkProgramHash}
            />
          ))}
        </div>
      )}
    </ProjectSection>
  )
}
