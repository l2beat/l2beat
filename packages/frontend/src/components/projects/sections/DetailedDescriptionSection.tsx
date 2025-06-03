import React from 'React'
import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface DetailedDescriptionSectionProps extends ProjectSectionProps {
  description: string
  detailedDescription: string | undefined
}

export function DetailedDescriptionSection({
  description,
  detailedDescription,
  ...sectionProps
}: DetailedDescriptionSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <div className="mt-4 text-gray-850 leading-snug dark:text-gray-400">
        <Markdown>{description}</Markdown>
        {detailedDescription && (
          <Markdown className="mt-2">{detailedDescription}</Markdown>
        )}
      </div>
    </ProjectSection>
  )
}
