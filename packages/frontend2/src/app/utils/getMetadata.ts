import { type Metadata } from 'next'

interface MetadataParams extends Metadata {
  title: string
  image: string
  description?: string
}

export function getMetadata(params: MetadataParams): Metadata {
  return {
    ...params,
    title: params.title,
    description:
      params.description ??
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    twitter: {
      images: [params.image],
      ...params.twitter,
    },
    openGraph: {
      images: [params.image],
      // TODO: Do we need URL?
      // url
      ...params.openGraph,
    },
  }
}
