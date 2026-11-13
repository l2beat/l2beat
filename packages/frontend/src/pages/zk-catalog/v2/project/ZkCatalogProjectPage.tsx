import type { ProjectZkCatalogEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ProjectIntro } from '../../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../../project/ProjectPage'
import { ProjectZkCatalogSummary } from './components/header/ZkCatalogProjectSummary'

interface Props extends ProjectPageCommonProps {
  projectEntry: ProjectZkCatalogEntry
}

export function ZkCatalogProjectPage({ projectEntry, ...props }: Props) {
  return (
    <ProjectPage
      {...props}
      project={{
        ...projectEntry,
        isUnderReview: !!projectEntry.underReviewStatus,
      }}
      header={{ secondLine: projectEntry.creator }}
      intro={
        <ProjectIntro
          status={projectEntry}
          versions={props.versionLinks}
          description={projectEntry.header.description}
          links={projectEntry.header.links}
        />
      }
      summary={<ProjectZkCatalogSummary project={projectEntry} />}
      sections={projectEntry.sections}
    />
  )
}
