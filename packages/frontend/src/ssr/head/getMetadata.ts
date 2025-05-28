import type { Manifest } from '~/utils/Manifest'
import { getBaseUrl } from '~/utils/get-base-url'
import { getPureDefaultMetadata } from '~/utils/metadata'
import { stripQueryParams } from '~/utils/stripQueryParams'

export type OpenGraph = {
  url: string
  type: 'article' | 'website'
  image?: string
}

export interface Metadata {
  title: string
  description: string
  openGraph: OpenGraph
}

type PartialMetadata = {
  title?: string
  description?: string
  openGraph: {
    url: string
    image?: string
    type?: 'article' | 'website'
  }
}

export function getMetadata(manifest: Manifest, metadata: PartialMetadata) {
  const { title, description, openGraph, ...rest } = metadata ?? {}
  return {
    ...getPureDefaultMetadata({
      title,
      description,
    }),
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
