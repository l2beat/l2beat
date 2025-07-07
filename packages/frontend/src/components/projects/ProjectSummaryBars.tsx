import { EmergencyIcon } from '~/icons/Emergency'
import {
  type UnderReviewStatus,
  getUnderReviewText,
} from '~/utils/project/underReview'
import { WarningBar } from '../WarningBar'
import { ArchivedBar } from './ArchivedBar'
import { UnderReviewBar } from './UnderReviewBar'
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
      {project.archivedAt && <ArchivedBar />}
      {project.isUpcoming && <UpcomingBar />}
      {project.underReviewStatus && (
        <UnderReviewBar text={getUnderReviewText(project.underReviewStatus)} />
      )}
      {project.header?.warning && (
        <WarningBar
          text={project.header.warning}
          color="yellow"
          className="w-full items-center justify-center p-2.5 text-xs md:text-base"
        />
      )}
      {project.header?.redWarning && (
        <WarningBar
          text={project.header.redWarning}
          color="red"
          className="w-full items-center justify-center p-2.5 text-xs md:text-base"
        />
      )}
      {project.header?.emergencyWarning && (
        <WarningBar
          text={project.header.emergencyWarning}
          icon={EmergencyIcon}
          color="yellow"
          className="w-full items-center justify-center p-2.5 text-xs md:text-base"
        />
      )}
    </div>
  )
}
