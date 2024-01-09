import React from 'react'

import { Link } from '../Link'
import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface DetailedDescriptionSectionProps {
  id: ProjectSectionId
  title: string
  editLink: string
  issueLink: string
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
      <p className="mt-4 leading-snug text-gray-850 dark:text-gray-400">
        If you find something wrong on this page you can{' '}
        <Link href={props.issueLink}>submit an issue</Link>
        {' or '}
        <Link href={props.editLink}>edit the information</Link>.
      </p>
    </ProjectDetailsSection>
  )
}
