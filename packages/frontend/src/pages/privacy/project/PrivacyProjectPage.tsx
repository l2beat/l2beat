import type { ZkCatalogSummary } from '~/pages/zk-catalog/v2/project/components/header/ZkCatalogProjectSummary'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { ProjectIntro } from '../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../project/ProjectPage'
import { PrivacyProjectSummaryCard } from './components/PrivacyProjectSummaryCard'

interface Props extends ProjectPageCommonProps {
  entry: ProjectPrivacyEntry
  /** For a privacy protocol that is also in the ZK Catalog. */
  zkCatalog?: {
    creator?: string
    header: ZkCatalogSummary
  }
}

export function PrivacyProjectPage({ entry, zkCatalog, ...props }: Props) {
  return (
    <ProjectPage
      {...props}
      project={entry}
      header={{
        recentUpdatesCount: entry.recentUpdatesCount,
        // "Railgun by Railgun" says nothing
        secondLine:
          zkCatalog?.creator !== entry.name ? zkCatalog?.creator : undefined,
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
          badges={entry.badges.length > 0 ? entry.badges : undefined}
          description={entry.description}
          links={entry.projectLinks}
          discoUiHref={entry.discoveryHref}
        />
      }
      summary={
        <PrivacyProjectSummaryCard
          entry={entry}
          zkCatalog={zkCatalog?.header}
        />
      }
      sections={entry.sections}
    />
  )
}
