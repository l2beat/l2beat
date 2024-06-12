import { ScalingProjectStateValidation } from '@l2beat/config'
import React from 'react'

import { HorizontalSeparator } from '../../../../components/HorizontalSeparator'
import { Markdown } from '../../../../components/Markdown'
import { ProjectSection } from './common/ProjectSection'
import { RiskList } from './common/RiskList'
import { ProjectSectionId } from './common/sectionId'

export interface StateValidationSectionProps {
  id: ProjectSectionId
  title: string
  stateValidation: ScalingProjectStateValidation
  sectionOrder: number
  image: string | undefined
  isUnderReview: boolean | undefined
}

export function StateValidationSection(props: StateValidationSectionProps) {
  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={props.isUnderReview}
    >
      {props.image && (
        <figure className="mt-4 mb-8 text-center">
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.image}
            alt="A diagram of the state validation"
          />
          <figcaption className="text-gray-500 text-xs dark:text-gray-600">
            A diagram of the state validation
          </figcaption>
        </figure>
      )}
      <div className="flex flex-col gap-6">
        <Markdown className="text-gray-850 leading-snug dark:text-gray-400 md:text-lg">
          {props.stateValidation.description}
        </Markdown>
        <HorizontalSeparator />
        {props.stateValidation.categories.map((stateValidationCategory) => (
          <Item
            stateValidationCategory={stateValidationCategory}
            key={stateValidationCategory.title}
          />
        ))}
      </div>
    </ProjectSection>
  )
}

function Item(props: {
  stateValidationCategory: ScalingProjectStateValidation['categories'][number]
}) {
  const risks = props.stateValidationCategory.risks?.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return (
    <div>
      <span className="font-bold text-lg uppercase md:text-xl">
        {props.stateValidationCategory.title}
      </span>
      <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400 md:text-lg">
        {props.stateValidationCategory.description}
      </Markdown>
      {risks && <RiskList risks={risks} />}
    </div>
  )
}
