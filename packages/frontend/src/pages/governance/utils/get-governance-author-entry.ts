import type { CollectionEntry } from '~/content/get-collection'
import type { ImageParams } from '~/utils/project/get-image-params'
import { getImageParams } from '~/utils/project/get-image-params'

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
