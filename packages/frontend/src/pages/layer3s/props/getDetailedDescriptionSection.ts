import { Layer3 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'

import { DetailedDescriptionSectionProps } from '../../../components/project/DetailedDescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDetailedDescriptionSection(
  project: Layer3,
): DetailedDescriptionSectionProps {
  return {
    id: 'detailed-description',
    title: 'Detailed description',
    issueLink: getIssueLink(`Problem: ${project.display.name} project page`),
    editLink: getEditLink(project),
    description: project.display.description,
    detailedDescription: project.display.detailedDescription,
  }
}
