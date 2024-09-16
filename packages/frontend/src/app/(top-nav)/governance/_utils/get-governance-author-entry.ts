import type { CollectionEntry } from '~/content/get-collection'

export interface GovernanceAuthorEntry {
  id: string
  firstName: string
  lastName: string
  role: string
}

export function getGovernanceAuthorEntry(
  author: CollectionEntry<'authors'>,
): GovernanceAuthorEntry {
  return {
    id: author.id,
    firstName: author.data.firstName,
    lastName: author.data.lastName,
    role: author.data.role,
  }
}
