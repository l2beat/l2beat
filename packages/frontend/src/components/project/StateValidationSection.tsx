import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface StateValidationSectionProps {
  stateValidation: string
  id: ProjectSectionId
  title: string
}

export function StateValidationSection(props: StateValidationSectionProps) {
  return (
    <ProjectDetailsSection title={props.title} id={props.id}>
      <Markdown className="text-lg leading-snug text-gray-850 dark:text-gray-400">
        {props.stateValidation}
      </Markdown>
    </ProjectDetailsSection>
  )
}
