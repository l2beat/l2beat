import type { Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/types'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import type { CommonProjectEntry } from '../utils/get-common-project-entry'

export interface CommonBridgesEntry
  extends CommonProjectEntry,
    FilterableEntry {}

export function getCommonBridgesEntry({
  project,
  changes,
}: {
  project: Project<'statuses' | 'bridgeInfo'>
  changes: ProjectChanges
}): CommonBridgesEntry {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    href: `/bridges/projects/${project.slug}`,
    filterable: [
      {
        id: 'type',
        value: project.bridgeInfo.category,
      },
      {
        id: 'validatedBy',
        value: project.bridgeInfo.validatedBy,
      },
    ],
    statuses: {
      yellowWarning: project.statuses.yellowWarning,
      verificationWarning: project.statuses.isUnverified,
      underReview: getUnderReviewStatus({
        isUnderReview: project.statuses.isUnderReview,
        ...changes,
      }),
    },
  }
}
