import type { ReferenceLink } from '@l2beat/config'
import type { HostChainRisksWarningProps } from '~/components/host-chain-risks-warning'
import { HostChainRisksWarning } from '~/components/host-chain-risks-warning'
import { Markdown } from '~/components/markdown/markdown'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/project-details-related-project-banner'
import { ProjectDetailsRelatedProjectBanner } from '~/components/project-details-related-project-banner'
import { UnderReviewCallout } from '../under-review-callout'
import { TechnologyIncompleteNote } from './contracts/technology-incomplete-note'
import { ProjectSection } from './project-section'
import { ReferenceList } from './reference-list'
import type { TechnologyRisk } from './risk-list'
import { RiskList } from './risk-list'
import type { ProjectSectionProps } from './types'

export interface TechnologySectionProps extends ProjectSectionProps {
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

export function TechnologySection({
  items,
  hostChainWarning,
  ...sectionProps
}: TechnologySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {hostChainWarning && <HostChainRisksWarning {...hostChainWarning} />}
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
