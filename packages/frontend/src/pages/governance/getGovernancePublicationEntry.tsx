import { ContentEntry } from '../../content/getContent'

export interface GovernancePublicationEntry {
  id: string
  title: string
  link: string
}

export function getGovernancePublicationEntry(
  post: ContentEntry<'publications'>,
): GovernancePublicationEntry {
  return {
    id: post.id,
    title: post.data.title,
    link: post.data.link,
  }
}
