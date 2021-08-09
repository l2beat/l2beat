import { Project } from '@l2beat/config'
import { OverviewSectionProps } from '../view/OverviewSection'
import { getEditLink, getIssueLink } from './links'

export function getOverviewSection(project: Project): OverviewSectionProps {
  return {
    links: project.details.links,
    issueLink: getIssueLink(`Problem: ${project.name} - Project overview`),
    editLink: getEditLink(project),
    warning: project.details.warning,
  }
}
