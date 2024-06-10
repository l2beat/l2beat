import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { ProjectSection } from './common/ProjectSection'
import { ProjectSectionId } from './common/sectionId'

export interface UpgradesAndGovernanceSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  content: string
  image: string | undefined
  isUnderReview: boolean | undefined
}

export function UpgradesAndGovernanceSection(
  props: UpgradesAndGovernanceSectionProps,
) {
  return (
    <ProjectSection
      id={props.id}
      title={props.title}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
      includeChildrenIfUnderReview
    >
      {props.image && (
        <figure className="mt-4 mb-8 text-center">
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.image}
            alt="A diagram of the upgrades and governance"
          />
          <figcaption className="text-gray-500 text-xs dark:text-gray-600">
            A diagram of the upgrades and governance
          </figcaption>
        </figure>
      )}
      <Markdown className="text-gray-850 leading-snug dark:text-gray-400 md:text-lg">
        {props.content}
      </Markdown>
    </ProjectSection>
  )
}
