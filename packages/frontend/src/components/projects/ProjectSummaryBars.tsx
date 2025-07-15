import { externalLinks } from '~/consts/externalLinks'
import {
  getUnderReviewText,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { Banner } from '../Banner'
import { CustomLink } from '../link/CustomLink'

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

export function ProjectSummaryBars({
  project,
  showBridgesWarning,
}: {
  project: Project
  showBridgesWarning?: boolean
}) {
  if (
    !project.archivedAt &&
    !project.isUpcoming &&
    !project.underReviewStatus &&
    !project.header?.warning &&
    !project.header?.redWarning &&
    !project.header?.emergencyWarning &&
    !showBridgesWarning
  ) {
    return null
  }

  return (
    <div className="mb-3 space-y-2">
      {showBridgesWarning && (
        <Banner type="warning" centered>
          <p>
            L2BEAT Bridges is a work in progress. You might find incomplete
            research or inconsistent naming. Join our{' '}
            <CustomLink href={externalLinks.discord}>Discord</CustomLink> to
            suggest improvements!
          </p>
        </Banner>
      )}
      {project.archivedAt && (
        <Banner type="info" centered>
          This project is archived and no longer maintained.
        </Banner>
      )}
      {project.isUpcoming && (
        <Banner type="info" centered>
          This is an upcoming project. Stay tuned!
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
          {project.header.redWarning}
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
