import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface StateValidationSectionProps {
  stateValidation: string
  id: ProjectSectionId
  title: string
  sectionOrder: number
  image: string | undefined
  isUnderReview: boolean | undefined
}

export function StateValidationSection(props: StateValidationSectionProps) {
  return (
    <ProjectDetailsSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
    >
      {props.image && (
        <figure className="mb-8 mt-4 text-center">
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.image}
            alt="A diagram of the state validation"
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            A diagram of the state validation
          </figcaption>
        </figure>
      )}
      <Markdown className="text-lg leading-snug text-gray-850 dark:text-gray-400">
        {props.stateValidation}
      </Markdown>
    </ProjectDetailsSection>
  )
}
