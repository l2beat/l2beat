import { MobileBadgesSection } from '~/components/projects/sections/BadgesSection'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { ProjectIntro } from '../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../project/ProjectPage'
import type { ZkCatalogMergedSummary } from '../../zk-catalog/v2/project/components/header/ZkCatalogProjectSummary'
import { PrivacyProjectSummaryCard } from './components/PrivacyProjectSummaryCard'

interface Props extends ProjectPageCommonProps {
  entry: ProjectPrivacyEntry
  /**
   * For a privacy protocol that is also in the ZK Catalog. Its summary is
   * part of this page, not a page of its own, as a second page component
   * would split the chunks the two share (see `smallSharedChunks.mts`).
   */
  zkCatalog?: ZkCatalogMergedSummary
}

export function PrivacyProjectPage({ entry, zkCatalog, ...props }: Props) {
  return (
    <ProjectPage
      {...props}
      project={entry}
      header={{
        recentUpdatesCount: entry.recentUpdatesCount,
        secondLine: zkCatalog?.creator,
      }}
      intro={
        <ProjectIntro
          status={{
            archivedAt: entry.archivedAt,
            underReviewStatus: entry.isUnderReview ? 'config' : undefined,
            header: {
              warning: entry.warnings.yellow,
              redWarning: entry.warnings.red,
              emergencyWarning: entry.warnings.emergency,
            },
          }}
          versions={props.versionLinks}
          badges={
            entry.badges.length > 0 && (
              <MobileBadgesSection badges={entry.badges} />
            )
          }
          description={entry.description}
          links={entry.projectLinks}
          discoUiHref={entry.discoveryHref}
        />
      }
      summary={
        <PrivacyProjectSummaryCard entry={entry} zkCatalog={zkCatalog} />
      }
      sections={entry.sections}
    />
  )
}
