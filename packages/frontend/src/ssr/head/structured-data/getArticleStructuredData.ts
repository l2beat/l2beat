import type { CollectionEntry } from '~/content/getCollection'
import { getCollectionEntry } from '~/content/getCollection'
import type { Manifest } from '~/utils/Manifest'
import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

export function getPublicationArticleStructuredData(
  manifest: Manifest,
  post:
    | CollectionEntry<'governance-publications'>
    | CollectionEntry<'other-publications'>,
) {
  return getArticle(manifest, {
    id: post.id,
    headline: post.data.title,
    description: post.data.description ?? post.excerpt,
    publishedOn: post.data.publishedOn,
    author: getAuthor(post.data.authorId),
  })
}

export function getMonthlyUpdateArticleStructuredData(
  manifest: Manifest,
  update: CollectionEntry<'monthly-updates'>,
) {
  return getArticle(manifest, {
    id: update.id,
    headline: update.data.title,
    description: update.data.description,
    publishedOn: update.data.publishedOn,
    author: L2BEAT_ORGANIZATION,
  })
}

interface ArticleFields {
  id: string
  headline: string
  description: string | undefined
  publishedOn: Date
  author: object
}

function getArticle(manifest: Manifest, article: ArticleFields) {
  const url = toProductionUrl(`/publications/${article.id}`)
  return withSchemaOrgContext({
    '@type': 'Article',
    '@id': url,
    url,
    mainEntityOfPage: url,
    headline: article.headline,
    ...(article.description && { description: article.description }),
    image: toProductionUrl(
      manifest.getUrl(`/meta-images/publications/${article.id}.png`),
    ),
    // Content dates are calendar days, so the time of day would be invented.
    datePublished: article.publishedOn.toISOString().slice(0, 10),
    author: article.author,
    publisher: L2BEAT_ORGANIZATION,
  })
}

function getAuthor(authorId: string) {
  const author = getCollectionEntry('authors', authorId)
  if (!author) {
    throw new Error(`Author not found: ${authorId}`)
  }
  return {
    '@type': 'Person',
    name: `${author.data.firstName} ${author.data.lastName}`,
    ...(author.data.role && { jobTitle: author.data.role }),
  }
}
