import React from 'react'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

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
      <div className="text-gray-850 mt-4 leading-snug dark:text-gray-400">
        <Markdown>{description}</Markdown>
        {detailedDescription && (
          <Markdown className="mt-2">{detailedDescription}</Markdown>
        )}
      </div>
    </ProjectSection>
  )
}
