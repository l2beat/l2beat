import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { UnderReviewCallout } from '../../../../components/project/UnderReviewCallout'
import { ReferenceList, TechnologyReference } from './common/ReferenceList'
import { RiskList, TechnologyRisk } from './common/RiskList'
import { Section } from './common/Section'
import { ProjectSectionId } from './common/sectionId'
import { TechnologyIncompleteShort } from './common/TechnologyIncomplete'

export interface TechnologySectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
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
  sectionOrder,
  items,
  isUnderReview,
}: TechnologySectionProps) {
  return (
    <Section
      title={title}
      id={id}
      sectionOrder={sectionOrder}
      isUnderReview={isUnderReview}
    >
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="text-lg font-bold md:text-xl">
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
    </Section>
  )
}
