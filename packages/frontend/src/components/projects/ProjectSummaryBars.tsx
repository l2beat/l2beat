import {
  getUnderReviewText,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { Banner } from '../Banner'
import { UpcomingBar } from './UpcomingBar'

interface Project {
  archivedAt?: number
  isUpcoming?: boolean
  underReviewStatus?: UnderReviewStatus
  header?: {
    warning?: string
    redWarning?: string
    emergencyWarning?: string
  }
}

export function ProjectSummaryBars({ project }: { project: Project }) {
  if (
    !project.archivedAt &&
    !project.isUpcoming &&
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
        <Banner type="neutral" centered>
          This project is archived and no longer maintained.
        </Banner>
      )}
      {project.isUpcoming && <UpcomingBar />}
      {project.underReviewStatus && (
        <Banner type="warning">
          {getUnderReviewText(project.underReviewStatus)}
        </Banner>
      )}
      {project.header?.warning && (
        <Banner type="warning" centered>
          {project.header.warning}
        </Banner>
      )}
      {project.header?.redWarning && (
        <Banner type="negative" centered>
          {project.header.redWarning}
        </Banner>
      )}
      {project.header?.emergencyWarning && (
        <Banner type="warning" centered>
          {project.header.emergencyWarning}
        </Banner>
      )}
    </div>
  )
}
