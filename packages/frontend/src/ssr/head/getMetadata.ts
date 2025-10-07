import { env } from '~/env'
import type { Manifest } from '~/utils/Manifest'
import { stripQueryParams } from '~/utils/stripQueryParams'

type OpenGraph = {
  url: string
  type: 'article' | 'website'
  image?: string
}

export interface Metadata {
  title: string
  description: string
  openGraph: OpenGraph
  excludeFromSearchEngines?: boolean
}

type PartialMetadata = {
  title?: string
  description?: string
  openGraph: {
    url: string
    image?: string
    type?: 'article' | 'website'
  }
  excludeFromSearchEngines?: boolean
}

export function getMetadata(
  manifest: Manifest,
  metadata: PartialMetadata,
): Metadata {
  const { title, description, openGraph, ...rest } = metadata ?? {}
  return {
    title: title ?? 'L2BEAT - The state of the layer two ecosystem',
    description:
      description ??
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    openGraph: getOpenGraph(manifest, openGraph),
    ...rest,
  }
}

function getOpenGraph(
  manifest: Manifest,
  { url, image, type }: PartialMetadata['openGraph'],
): OpenGraph {
  const baseUrl = getBaseUrl()
  return {
    url: baseUrl + stripQueryParams(url),
    image: image ? baseUrl + manifest.getUrl(image) : undefined,
    type: type ?? 'website',
  }
}

function getBaseUrl() {
  if (env.DEPLOYMENT_ENV === 'production') return 'https://l2beat.com'
  if (env.DEPLOYMENT_ENV === 'staging') return 'https://fe-staging.l2beat.com/'
  if (env.HEROKU_APP_NAME) return `https://${env.HEROKU_APP_NAME}.herokuapp.com`
  return 'http://localhost:3000'
}
