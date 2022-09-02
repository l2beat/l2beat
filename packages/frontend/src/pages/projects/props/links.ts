import { Project } from '@l2beat/config'

export function getEditLink(project: Project) {
  return `https://github.com/l2beat/l2beat/edit/master/packages/config/src/projects/${project.slug}.ts`
}

export function getIssueLink(title: string) {
  return `https://github.com/l2beat/l2beat/issues/new?title=${title}&labels=website`
}
