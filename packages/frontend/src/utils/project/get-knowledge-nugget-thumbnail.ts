import type { KnowledgeNugget } from '@l2beat/config'

const THUMBNAILS_FOLDER = '/images/thumbnails/'
const DEFAULT_THUMBNAIL = THUMBNAILS_FOLDER + 'default.jpg'

export function getKnowledgeNuggetThumbnail(
  knowledgeNugget: KnowledgeNugget,
): string {
  if (knowledgeNugget.thumbnail === undefined) {
    return DEFAULT_THUMBNAIL
  }

  return THUMBNAILS_FOLDER + knowledgeNugget.thumbnail
}
