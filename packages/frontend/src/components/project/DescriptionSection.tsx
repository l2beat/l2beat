import React from 'react'

import { Link } from '../Link'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { SectionId } from './sectionId'
import { WarningBar } from './WarningBar'

export interface DescriptionSectionProps {
  id: SectionId
  title: string
  editLink: string
  issueLink: string
  description: string
  warning?: string
  isVerified?: boolean
}

export function DescriptionSection(props: DescriptionSectionProps) {
  return (
    <ProjectDetailsSection title={props.title} id={props.id}>
      {props.isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
        />
      )}
      {props.warning && (
        <WarningBar
          text={props.warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}
      <p className="mt-4 text-gray-850 dark:text-gray-400">
        {props.description}
      </p>
      <p className="mt-4 text-gray-850 dark:text-gray-400">
        If you find something wrong on this page you can{' '}
        <Link href={props.issueLink}>submit an issue</Link>
        {' or '}
        <Link href={props.editLink}>edit the information</Link>.
      </p>
    </ProjectDetailsSection>
  )
}
