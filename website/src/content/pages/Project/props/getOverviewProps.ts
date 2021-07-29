import { Project, ProjectLinks } from '@l2beat/config'
import { getEditLink, getIssueLink } from './links'

export interface OverviewProps {
  links: ProjectLinks
  issueLink: string
  editLink: string
  warning?: string
}

export function getOverviewProps(project: Project) {
  return {
    links: project.details.links,
    issueLink: getIssueLink(`Problem: ${project.name} - Project overview`),
    editLink: getEditLink(project),
    warning: project.details.warning,
  }
}
