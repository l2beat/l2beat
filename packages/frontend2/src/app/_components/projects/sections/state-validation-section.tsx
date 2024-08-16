import { type ScalingProjectStateValidation } from '@l2beat/config'
import React from 'react'
import { type DiagramParams } from '~/utils/project/get-diagram-params'
import { HorizontalSeparator } from '../../horizontal-separator'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { RiskList } from './risk-list'
import { type ProjectSectionProps } from './types'

export interface StateValidationSectionProps extends ProjectSectionProps {
  diagram: DiagramParams | undefined
  stateValidation: ScalingProjectStateValidation
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
      {props.diagram && (
        <figure className="mb-8 mt-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="inline max-w-full align-[unset] dark:invert"
            src={props.diagram.src}
            alt={props.diagram.caption}
          />
          <figcaption className="text-xs text-gray-500 dark:text-gray-600">
            {props.diagram.caption}
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
