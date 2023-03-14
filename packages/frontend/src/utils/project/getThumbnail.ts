import { KnowledgeNugget, NUGGETS } from '@l2beat/config'

export const THUMBNAILS_FOLDER = '/images/thumbnails/'

export function getThumbnail(knowledgeNugget: KnowledgeNugget): string {
  if (knowledgeNugget.thumbnail === undefined) {
    return THUMBNAILS_FOLDER + NUGGETS.THUMBNAILS.DEFAULT
  }

  return THUMBNAILS_FOLDER + knowledgeNugget.thumbnail
}
