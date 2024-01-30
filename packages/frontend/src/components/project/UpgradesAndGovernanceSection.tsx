import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface UpgradesAndGovernanceSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  content: string
}

export function UpgradesAndGovernanceSection(
  props: UpgradesAndGovernanceSectionProps,
) {
  return (
    <ProjectDetailsSection
      id={props.id}
      title={props.title}
      sectionOrder={props.sectionOrder}
    >
      <Markdown>{props.content}</Markdown>
    </ProjectDetailsSection>
  )
}
