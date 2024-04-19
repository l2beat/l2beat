import { ScalingProjectStateValidation } from '@l2beat/config'
import React from 'react'

import { HorizontalSeparator } from '../../../../components/HorizontalSeparator'
import { Markdown } from '../../../../components/Markdown'
import { RiskList } from './common/RiskList'
import { Section } from './common/Section'
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
    <Section
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
      <div className="flex flex-col gap-6">
        <Markdown className="leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
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
    </Section>
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
      <span className="text-lg font-bold uppercase md:text-xl">
        {props.stateValidationCategory.title}
      </span>
      <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
        {props.stateValidationCategory.description}
      </Markdown>
      {risks && <RiskList risks={risks} />}
    </div>
  )
}
