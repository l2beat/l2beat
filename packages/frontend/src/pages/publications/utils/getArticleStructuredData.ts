import { UnixTime } from '@l2beat/shared-pure'
import { L2BEAT_ORGANIZATION } from '~/ssr/head/structured-data/getOrganizationStructuredData'
import type { StructuredDataPage } from '~/ssr/head/structured-data/StructuredData'

export function getArticleStructuredData(
  page: StructuredDataPage,
  article: Article,
) {
  return {
    '@type': 'Article',
    '@id': page.url,
    url: page.url,
    mainEntityOfPage: page.url,
    headline: article.headline,
    description: article.description ?? page.description,
    image: page.image,
    datePublished: toCalendarDate(article.publishedOn),
    author: article.author ? toPerson(article.author) : L2BEAT_ORGANIZATION,
    publisher: L2BEAT_ORGANIZATION,
  }
}

interface Article {
  headline: string
  publishedOn: Date
  /** Omitted for posts without a single author, which L2BEAT is credited for. */
  author?: Author
  /** For posts whose own summary differs from the page's meta description. */
  description?: string
}

interface Author {
  firstName: string
  lastName: string
  role: string | undefined
}

function toPerson(author: Author) {
  return {
    '@type': 'Person' as const,
    name: `${author.firstName} ${author.lastName}`,
    ...(author.role && { jobTitle: author.role }),
  }
}

function toCalendarDate(date: Date) {
  return UnixTime.toYYYYMMDD(UnixTime.fromDate(date))
}
