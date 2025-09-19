import { UnixTime } from '@l2beat/shared-pure'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import type { ExternalPublicationTag } from '~/content/external-publications'
import type { CollectionEntry } from '~/content/getCollection'
import {
  getImageParams,
  type ImageParams,
} from '~/utils/project/getImageParams'

export interface PublicationEntry extends FilterableEntry {
  id: string
  title: string
  shortTitle: string | undefined
  description: string | undefined
  publishedOn: UnixTime
  thumbnail: ImageParams
  url: string
  tag: 'governance' | 'monthly-update' | ExternalPublicationTag
  customCtaText?: string
}

export function getPublicationEntryFromGovernance(
  governanceArticle: CollectionEntry<'governance-publications'>,
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
    publishedOn: UnixTime.fromDate(governanceArticle.data.publishedOn),
    url: `/publications/${governanceArticle.id}`,
    tag: 'governance',
    filterable: [
      {
        id: 'contentCategory',
        value: 'Governance',
      },
    ],
  }
}

export function getPublicationEntryFromMonthlyUpdate(
  monthlyUpdate: CollectionEntry<'monthly-updates'>,
): PublicationEntry {
  const thumbnail = getImageParams(
    `/meta-images/publications/${monthlyUpdate.id}.png`,
  )
  if (!thumbnail) {
    throw new Error(`Thumbnail not found for ${monthlyUpdate.id}`)
  }
  return {
    id: monthlyUpdate.id,
    title: monthlyUpdate.data.title,
    thumbnail,
    shortTitle: undefined,
    description: monthlyUpdate.data.description,
    publishedOn: UnixTime.fromDate(monthlyUpdate.data.publishedOn),
    url: `/publications/${monthlyUpdate.id}`,
    tag: 'monthly-update',
    filterable: [
      {
        id: 'contentCategory',
        value: 'Monthly Update',
      },
    ],
  }
}

export function getPublicationEntryFromExternalPublication(
  externalPublication: CollectionEntry<'external-publications'>,
): PublicationEntry {
  const thumbnail = getImageParams(
    `/meta-images/publications/${externalPublication.id}.png`,
  )
  if (!thumbnail) {
    throw new Error(`Thumbnail not found for ${externalPublication.id}`)
  }
  return {
    id: externalPublication.id,
    title: externalPublication.data.title,
    thumbnail,
    shortTitle: undefined,
    description: externalPublication.data.description,
    publishedOn: UnixTime.fromDate(externalPublication.data.publishedOn),
    url: externalPublication.data.url,
    tag: externalPublication.data.tag,
    customCtaText: externalPublication.data.ctaText,
    filterable: [
      {
        id: 'contentCategory',
        value: externalPublication.data.tag,
      },
    ],
  }
}
