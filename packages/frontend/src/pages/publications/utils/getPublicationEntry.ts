import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import type { CollectionEntry } from '~/content/getCollection'
import { formatPublicationDate } from '~/utils/dates'
import {
  getImageParams,
  type ImageParams,
} from '~/utils/project/getImageParams'

export interface PublicationEntry extends FilterableEntry {
  id: string
  title: string
  shortTitle: string | undefined
  description: string | undefined
  publishedOn: string
  thumbnail: ImageParams
  url: string
  tag: 'governance'
}

export function getPublicationEntryFromGovernance(
  governanceArticle: CollectionEntry<'publications'>,
): PublicationEntry {
  const thumbnail = getImageParams(
    `/meta-images/publications/${governanceArticle.id}.png`,
  )
  if (!thumbnail) {
    throw new Error(`Thumbnail not found for ${governanceArticle.id}`)
  }
  return {
    id: governanceArticle.id,
    title: governanceArticle.data.title,
    thumbnail,
    shortTitle: governanceArticle.data.shortTitle,
    description: governanceArticle.data.description,
    publishedOn: formatPublicationDate(governanceArticle.data.publishedOn),
    url: `governance/publications/${governanceArticle.id}`,
    tag: 'governance',
    filterable: [
      {
        id: 'contentCategory',
        value: 'Governance',
      },
    ],
  }
}
