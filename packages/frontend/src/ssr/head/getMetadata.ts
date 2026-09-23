import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { env } from '~/env'
import type { Manifest } from '~/utils/Manifest'
import { stripQueryParams } from '~/utils/stripQueryParams'
import {
  getBreadcrumbList,
  type PageBreadcrumb,
} from './structured-data/getBreadcrumbList'
import type { StructuredData } from './structured-data/StructuredData'

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
  structuredData: StructuredData[]
}

type PartialMetadata = {
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
  breadcrumb?: PageBreadcrumb
  /** Page-specific JSON-LD; the BreadcrumbList is added for every page. */
  structuredData?: StructuredData[]
}

export function getMetadata(
  manifest: Manifest,
  metadata: PartialMetadata,
): Metadata {
  const {
    title,
    description,
    url,
    openGraph,
    breadcrumb,
    structuredData,
    ...rest
  } = metadata ?? {}
  const strippedPath = stripQueryParams(url)
  const baseUrl = getBaseUrl()
  return {
    title: title ?? 'L2BEAT - The state of the layer two ecosystem',
    description:
      description ??
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    url: baseUrl + strippedPath,
    openGraph: getOpenGraph(manifest, baseUrl, openGraph),
    // We want canonical to always point to the production URL
    canonicalUrl: PRODUCTION_ORIGIN + strippedPath,
    // Crawlers skip noindex pages, so their structured data would go unread.
    structuredData: rest.excludeFromSearchEngines
      ? []
      : compact([
          getBreadcrumbList(strippedPath, title, breadcrumb),
          ...(structuredData ?? []),
        ]),
    ...rest,
  }
}

function getOpenGraph(
  manifest: Manifest,
  baseUrl: string,
  { image, type, dynamic }: PartialMetadata['openGraph'],
): OpenGraph {
  return {
    image: baseUrl + (dynamic ? image : manifest.getUrl(image)),
    type: type ?? 'website',
  }
}

function getBaseUrl() {
  if (env.DEPLOYMENT_ENV === 'production') return PRODUCTION_ORIGIN
  if (env.DEPLOYMENT_ENV === 'staging') return 'https://fe-stag.l2beat.com'
  if (env.COOLIFY_URL) return env.COOLIFY_URL
  return 'http://localhost:3000'
}
