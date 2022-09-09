import { Layer2 } from '@l2beat/config'

import { DescriptionSectionProps } from '../view/DescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDescriptionSection(
  project: Layer2,
): DescriptionSectionProps {
  return {
    issueLink: getIssueLink(`Problem: ${project.name} - Description`),
    editLink: getEditLink(project),
    warning: project.details.warning,
    description: project.details.description,
  }
}
