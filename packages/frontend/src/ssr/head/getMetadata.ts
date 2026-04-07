import { env } from '~/env'
import type { Manifest } from '~/utils/Manifest'
import { stripQueryParams } from '~/utils/stripQueryParams'

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
}

type PartialMetadata = {
  title?: string
  description?: string
  url: string
  openGraph: {
    image: string
    type?: 'article' | 'website'
  }
  excludeFromSearchEngines?: boolean
}

export function getMetadata(
  manifest: Manifest,
  metadata: PartialMetadata,
): Metadata {
  const { title, description, url, openGraph, ...rest } = metadata ?? {}
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
    canonicalUrl: 'https://l2beat.com' + strippedPath,
    ...rest,
  }
}

function getOpenGraph(
  manifest: Manifest,
  baseUrl: string,
  { image, type }: PartialMetadata['openGraph'],
): OpenGraph {
  return {
    image: baseUrl + manifest.getUrl(image),
    type: type ?? 'website',
  }
}

function getBaseUrl() {
  if (env.DEPLOYMENT_ENV === 'production') return 'https://l2beat.com'
  if (env.DEPLOYMENT_ENV === 'staging') return 'https://fe-stag.l2beat.com'
  if (env.COOLIFY_URL) return env.COOLIFY_URL
  return 'http://localhost:3000'
}
