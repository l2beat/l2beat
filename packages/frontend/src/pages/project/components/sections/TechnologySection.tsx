import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { UnderReviewCallout } from '../UnderReviewCallout'
import { ProjectSection } from './common/ProjectSection'
import { ReferenceList, TechnologyReference } from './common/ReferenceList'
import { RiskList, TechnologyRisk } from './common/RiskList'
import { TechnologyIncompleteShort } from './common/TechnologyIncomplete'
import { ProjectSectionId } from './common/sectionId'

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
    <ProjectSection
      title={title}
      id={id}
      sectionOrder={sectionOrder}
      isUnderReview={isUnderReview}
    >
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="font-bold text-lg md:text-xl">
            <a href={`#${item.id}`}>{item.name}</a>
          </h3>
          {item.isIncomplete && <TechnologyIncompleteShort />}
          {item.isUnderReview ? (
            <UnderReviewCallout />
          ) : (
            <>
              <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400">
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
