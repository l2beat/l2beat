import type { ReferenceLink } from '@l2beat/config'
import type { HostChainRisksWarningProps } from '~/components/HostChainRisksWarning'
import { HostChainRisksWarning } from '~/components/HostChainRisksWarning'
import { Markdown } from '~/components/markdown/Markdown'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/ProjectDetailsRelatedProjectBanner'
import { ProjectDetailsRelatedProjectBanner } from '~/components/ProjectDetailsRelatedProjectBanner'
import { UnderReviewCallout } from '../UnderReviewCallout'
import { SectionIncompleteNote } from './contracts/SectionIncompleteNote'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { TechnologyRisk } from './RiskList'
import { RiskList } from './RiskList'
import type { ProjectSectionProps } from './types'

export interface TechnologyChoicesSectionProps extends ProjectSectionProps {
  items: TechnologyChoice[]
  hostChainWarning?: HostChainRisksWarningProps
}

export interface TechnologyChoice {
  id: string
  name: string
  description: string
  isIncomplete: boolean
  isUnderReview: boolean
  risks: TechnologyRisk[]
  references: ReferenceLink[]
  relatedProjectBanner?: ProjectDetailsRelatedProjectBannerProps
}

export function TechnologyChoicesSection({
  items,
  hostChainWarning,
  ...sectionProps
}: TechnologyChoicesSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {hostChainWarning && <HostChainRisksWarning {...hostChainWarning} />}
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="font-bold text-lg md:text-xl">
            <a href={`#${item.id}`}>{item.name}</a>
          </h3>
          {item.isIncomplete && <SectionIncompleteNote />}
          {item.isUnderReview ? (
            <UnderReviewCallout />
          ) : (
            <>
              <Markdown className="mt-2 text-paragraph-15 md:text-paragraph-16">
                {item.description}
              </Markdown>
              <RiskList risks={item.risks} />
              <ReferenceList references={item.references} />{' '}
            </>
          )}
          {item.relatedProjectBanner && (
            <ProjectDetailsRelatedProjectBanner
              className="mt-4 md:mt-6"
              {...item.relatedProjectBanner}
            />
          )}
        </div>
      ))}
    </ProjectSection>
  )
}
