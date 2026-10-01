import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN, toProductionUrl } from '~/consts/productionOrigin'
import { env } from '~/env'
import { getMarkdownAlternatePath } from '~/utils/getMarkdownAlternatePath'
import type { Manifest } from '~/utils/Manifest'
import { stripQueryParams } from '~/utils/stripQueryParams'
import {
  type Breadcrumb,
  getBreadcrumbList,
} from './structured-data/getBreadcrumbList'
import type {
  StructuredData,
  StructuredDataPage,
} from './structured-data/StructuredData'

export const SITE_TITLE = 'L2BEAT - The state of the layer two ecosystem'
const SITE_DESCRIPTION =
  'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.'

type OpenGraph = {
  type: 'article' | 'website'
  image: string
}

export interface Metadata {
  title: string
  description: string
  url: string
  openGraph: OpenGraph
  canonicalUrl: string
  excludeFromSearchEngines?: boolean
  markdownAlternateUrl?: string
  structuredData: StructuredData[]
}

type PartialMetadata = {
  /** What the page is called: its last breadcrumb and, by default, its title. */
  name?: string
  /** For titles that say more than "<name> - L2BEAT". */
  title?: string
  description?: string
  url: string
  openGraph: {
    image: string
    type?: 'article' | 'website'
    /** For images rendered at runtime that are not in the static asset manifest */
    dynamic?: boolean
  }
  excludeFromSearchEngines?: boolean
  /** Pages between the section and this one, e.g. the project of a subpage. */
  breadcrumbParents?: Breadcrumb[]
  /** Page-specific JSON-LD; the BreadcrumbList is added for every page. */
  structuredData?: (page: StructuredDataPage) => (StructuredData | undefined)[]
}

export function getMetadata(
  manifest: Manifest,
  metadata: PartialMetadata,
): Metadata {
  const {
    name,
    title,
    description = SITE_DESCRIPTION,
    url,
    openGraph,
    breadcrumbParents,
    structuredData,
    ...rest
  } = metadata ?? {}
  const strippedPath = stripQueryParams(url)
  const baseUrl = getBaseUrl()
  const markdownAlternatePath = getMarkdownAlternatePath(strippedPath)
  const imagePath = openGraph.dynamic
    ? openGraph.image
    : manifest.getUrl(openGraph.image)
  // Production, whatever host rendered the page
  const canonicalUrl = toProductionUrl(strippedPath)
  return {
    title: title ?? (name ? `${name} - L2BEAT` : SITE_TITLE),
    description,
    url: baseUrl + strippedPath,
    openGraph: {
      image: baseUrl + imagePath,
      type: openGraph.type ?? 'website',
    },
    canonicalUrl,
    // Production, like canonical: the markdown cites production URLs too
    markdownAlternateUrl: markdownAlternatePath
      ? toProductionUrl(markdownAlternatePath)
      : undefined,
    // Crawlers skip noindex pages, so their structured data would go unread.
    structuredData: rest.excludeFromSearchEngines
      ? []
      : compact([
          getBreadcrumbList(strippedPath, name, breadcrumbParents),
          ...(structuredData?.({
            url: canonicalUrl,
            description,
            image: toProductionUrl(imagePath),
          }) ?? []),
        ]),
    ...rest,
  }
}

function getBaseUrl() {
  if (env.DEPLOYMENT_ENV === 'production') return PRODUCTION_ORIGIN
  if (env.DEPLOYMENT_ENV === 'staging') return 'https://fe-stag.l2beat.com'
  if (env.COOLIFY_URL) return env.COOLIFY_URL
  return 'http://localhost:3000'
}
