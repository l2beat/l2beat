import type { CollectionEntry } from '~/content/getCollection'
import type { ImageParams } from '~/utils/project/getImageParams'
import { getImageParams } from '~/utils/project/getImageParams'

export interface GovernanceAuthorEntry {
  id: string
  avatar: ImageParams
  firstName: string
  lastName: string
  role: string
}

export function getGovernanceAuthorEntry(
  author: CollectionEntry<'authors'>,
): GovernanceAuthorEntry {
  const avatar = getImageParams(`/images/avatars/${author.id}.png`)
  if (!avatar) {
    throw new Error(`Avatar not found for ${author.id}`)
  }

  return {
    id: author.id,
    avatar,
    firstName: author.data.firstName,
    lastName: author.data.lastName,
    role: author.data.role,
  }
}
