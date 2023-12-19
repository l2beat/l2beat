import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { SectionId } from './sectionId'

export interface StateValidationSectionProps {
  stateValidation: string
  id: SectionId
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
