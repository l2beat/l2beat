import React from 'react'
import {
  ReferenceList,
  type TechnologyReference,
} from '../permissions/reference-list'
import { type TechnologyRisk, RiskList } from '../risk-list'
import { type ProjectSectionProps } from '../types'
import { Markdown } from '~/app/_components/markdown/markdown'
import { UnderReviewCallout } from '../../under-review-callout'
import { ProjectSection } from '../project-section'
import { TechnologyIncompleteNote } from '../contracts/technology-incomplete-note'

export interface TechnologySectionProps extends ProjectSectionProps {
  items: TechnologyChoice[]
  isUnderReview: boolean
}

export interface TechnologyChoice {
  id: string
  name: string
  description: string
  isIncomplete: boolean
  isUnderReview: boolean
  risks: TechnologyRisk[]
  references: TechnologyReference[]
}

export function TechnologySection({ items, ...props }: TechnologySectionProps) {
  return (
    <ProjectSection {...props}>
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="text-lg font-bold md:text-xl">
            <a href={`#${item.id}`}>{item.name}</a>
          </h3>
          {item.isIncomplete && <TechnologyIncompleteNote />}
          {item.isUnderReview ? (
            <UnderReviewCallout />
          ) : (
            <>
              <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
                {item.description}
              </Markdown>
              <RiskList risks={item.risks} />
              <ReferenceList references={item.references} />{' '}
            </>
          )}
        </div>
      ))}
    </ProjectSection>
  )
}
