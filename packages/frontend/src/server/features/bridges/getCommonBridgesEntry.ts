import type { BridgeCategory, Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import { manifest } from '~/utils/Manifest'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import type { ProjectChanges } from '../projects-change-report/getProjectsChangeReport'
import type { CommonProjectEntry } from '../utils/getCommonProjectEntry'
import { getIsProjectVerified } from '../utils/getIsProjectVerified'

export interface CommonBridgesEntry
  extends CommonProjectEntry,
    FilterableEntry {
  category: BridgeCategory
}

export function getCommonBridgesEntry({
  project,
  changes,
}: {
  project: Project<'statuses' | 'bridgeInfo' | 'bridgeRisks'>
  changes: ProjectChanges
}): CommonBridgesEntry {
  const statuses = {
    yellowWarning: project.statuses.yellowWarning,
    verificationWarning: !getIsProjectVerified(
      project.statuses.unverifiedContracts,
      changes,
    ),
    underReview: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      ...changes,
    }),
  }
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    backgroundColor: getRowBackgroundColor(statuses),
    filterable: [
      {
        id: 'type',
        value: project.bridgeInfo.category,
      },
      {
        id: 'validatedBy',
        value: project.bridgeRisks.validatedBy?.value ?? 'Unknown',
      },
    ],
    statuses,
    category: project.bridgeInfo.category,
  }
}
