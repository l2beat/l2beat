import { Markdown } from '~/components/markdown/markdown'
import { UnderReviewCallout } from '../under-review-callout'
import { TechnologyIncompleteNote } from './contracts/technology-incomplete-note'
import {
  ReferenceList,
  type TechnologyReference,
} from './permissions/reference-list'
import { ProjectSection } from './project-section'
import { RiskList, type TechnologyRisk } from './risk-list'
import { type ProjectSectionProps } from './types'

export interface TechnologySectionProps extends ProjectSectionProps {
  items: TechnologyChoice[]
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
  items,
  ...sectionProps
}: TechnologySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
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
