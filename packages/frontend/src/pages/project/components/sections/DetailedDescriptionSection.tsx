import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { ProjectSection } from './common/ProjectSection'
import { ProjectSectionId } from './common/sectionId'

export interface DetailedDescriptionSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  description: string
  detailedDescription: string | undefined
}

export function DetailedDescriptionSection(
  props: DetailedDescriptionSectionProps,
) {
  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
    >
      <div className="mt-4 leading-snug text-gray-850 dark:text-gray-400">
        <Markdown>{props.description}</Markdown>
        {props.detailedDescription && (
          <Markdown className="mt-2">{props.detailedDescription}</Markdown>
        )}
      </div>
    </ProjectSection>
  )
}
