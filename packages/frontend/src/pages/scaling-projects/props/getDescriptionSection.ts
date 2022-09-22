import { Layer2 } from '@l2beat/config'

import { DescriptionSectionProps } from '../../../components/project/DescriptionSection'
import { getEditLink, getIssueLink } from './links'

export function getDescriptionSection(
  project: Layer2,
): DescriptionSectionProps {
  return {
    issueLink: getIssueLink(`Problem: ${project.display.name} project page`),
    editLink: getEditLink(project),
    warning: project.display.warning,
    description: project.display.description,
  }
}
