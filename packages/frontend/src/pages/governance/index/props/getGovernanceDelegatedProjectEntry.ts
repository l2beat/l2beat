import { CollectionEntry } from '../../../../content/getCollection'

export interface GovernanceDelegatedProjectEntry {
  id: string
  name: string
  link: string
}

export function getGovernanceDelegatedProjectEntry(
  delegatedProject: CollectionEntry<'delegatedProjects'>,
): GovernanceDelegatedProjectEntry {
  return {
    id: delegatedProject.id,
    name: delegatedProject.data.name,
    link: delegatedProject.data.delegateTokensUrl,
  }
}
