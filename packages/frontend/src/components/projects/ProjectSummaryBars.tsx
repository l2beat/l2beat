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
          <span className="md:hidden">This project is archived.</span>
          <span className="hidden md:block">
            This project is archived and no longer maintained.
          </span>
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
