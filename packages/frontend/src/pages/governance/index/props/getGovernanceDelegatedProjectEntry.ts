import { ContentEntry } from '../../../../content/getContent'

export interface GovernanceDelegatedProjectEntry {
  id: string
  name: string
  link: string
}

export function getGovernanceDelegatedProjectEntry(
  delegatedProject: ContentEntry<'delegatedProjects'>,
): GovernanceDelegatedProjectEntry {
  return {
    id: delegatedProject.id,
    name: delegatedProject.data.name,
    link: delegatedProject.data.delegateTokensUrl,
  }
}
