import React from 'react'

import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { SectionId } from './sectionId'
import { TechnologyIncompleteShort } from './TechnologyIncomplete'
import { UnderReviewCallout } from './UnderReviewCallout'

export interface TechnologySectionProps {
  id: SectionId
  title: string
  items: TechnologyChoice[]
  isUnderReview?: boolean
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

export function TechnologySection({
  id,
  title,
  items,
  isUnderReview,
}: TechnologySectionProps) {
  return (
    <ProjectDetailsSection title={title} id={id} isUnderReview={isUnderReview}>
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="text-xl font-bold">
            <a href={`#${item.id}`}>{item.name}</a>
          </h3>
          {item.isIncomplete && <TechnologyIncompleteShort />}
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
    </ProjectDetailsSection>
  )
}
