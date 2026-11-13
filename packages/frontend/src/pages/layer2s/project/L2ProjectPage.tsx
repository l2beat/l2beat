import { WhyAmIHereNotice } from '~/components/countdowns/other-migration/WhyAmIHereNotice'
import { StageOneRequirementsChangeNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import type { PrivacySummary } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { ProjectIntro } from '../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../project/ProjectPage'
import { getPrivacyMergedSummary } from './components/getPrivacyMergedSummary'
import { ProjectL2Summary } from './components/L2ProjectSummary'

interface Props extends ProjectPageCommonProps {
  projectEntry: ProjectL2Entry
  /**
   * For a scaling project that is also a privacy protocol. Its summary is
   * part of this page, not a page of its own, as a second page component
   * would split the chunks the two share (see `smallSharedChunks.mts`).
   */
  privacy?: PrivacySummary
}

export function L2ProjectPage({ projectEntry, privacy, ...props }: Props) {
  const { header, stageConfig } = projectEntry
  return (
    <ProjectPage
      {...props}
      project={{
        ...projectEntry,
        isUnderReview: !!projectEntry.underReviewStatus,
      }}
      header={{
        ongoingAnomaly: header.ongoingAnomaly,
        recentUpdatesCount: header.recentUpdatesCount,
      }}
      intro={
        <ProjectIntro
          status={projectEntry}
          versions={props.versionLinks}
          badges={header.badges}
          description={header.description}
          links={header.links}
          discoUiHref={projectEntry.discoUiHref}
        />
      }
      summary={
        <>
          <ProjectL2Summary
            project={projectEntry}
            merged={
              privacy && getPrivacyMergedSummary(privacy, projectEntry.sections)
            }
          />
          {header.category === 'Other' &&
            projectEntry.reasonsForBeingOther &&
            projectEntry.reasonsForBeingOther.length > 0 && (
              <WhyAmIHereNotice reasons={projectEntry.reasonsForBeingOther} />
            )}
          {stageConfig.stage !== 'NotApplicable' &&
            stageConfig.stage !== 'UnderReview' &&
            stageConfig.downgradePending && (
              <StageOneRequirementsChangeNotice
                downgradePending={stageConfig.downgradePending}
              />
            )}
        </>
      }
      sections={projectEntry.sections}
    />
  )
}
