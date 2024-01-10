import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface DetailedDescriptionSectionProps {
  id: ProjectSectionId
  title: string
  description: string
  detailedDescription: string | undefined
}

export function DetailedDescriptionSection(
  props: DetailedDescriptionSectionProps,
) {
  return (
    <ProjectDetailsSection title={props.title} id={props.id}>
      <div className="mt-4 leading-snug text-gray-850 dark:text-gray-400">
        <Markdown>{props.description}</Markdown>
        {props.detailedDescription && (
          <Markdown className="mt-2">{props.detailedDescription}</Markdown>
        )}
      </div>
    </ProjectDetailsSection>
  )
}
