import type { ProjectRedWarning } from '@l2beat/config'
import {
  getUnderReviewText,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { Banner } from '../Banner'

interface Project {
  archivedAt?: number
  underReviewStatus?: UnderReviewStatus
  header?: {
    warning?: string
    redWarning?: ProjectRedWarning
    emergencyWarning?: string
  }
}

export function ProjectSummaryBars({ project }: { project: Project }) {
  if (
    !project.archivedAt &&
    !project.underReviewStatus &&
    !project.header?.warning &&
    !project.header?.redWarning &&
    !project.header?.emergencyWarning
  ) {
    return null
  }

  return (
    <div className="mb-3 space-y-2">
      {project.archivedAt && (
        <Banner type="info" centered>
          This project is archived and no longer maintained.
        </Banner>
      )}
      {project.underReviewStatus && (
        <Banner type="warning" centered asMarkdown>
          {getUnderReviewText(project.underReviewStatus)}
        </Banner>
      )}
      {project.header?.warning && (
        <Banner type="warning" centered asMarkdown>
          {project.header.warning}
        </Banner>
      )}
      {project.header?.redWarning && (
        <Banner type="negative" centered asMarkdown>
          {project.header.redWarning.text}
        </Banner>
      )}
      {project.header?.emergencyWarning && (
        <Banner type="warning" centered asMarkdown>
          {project.header.emergencyWarning}
        </Banner>
      )}
    </div>
  )
}
