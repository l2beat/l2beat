import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDescriptionSection(
  project: Layer2,
  verificationStatus: VerificationStatus,
): DescriptionSectionProps {
  return {
    issueLink: getIssueLink(`Problem: ${project.display.name} project page`),
    editLink: getEditLink(project),
    warning: project.display.warning,
    description: project.display.description,
    isVerified: verificationStatus.projects[project.id.toString()],
  }
}
