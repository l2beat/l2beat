import type { Metadata } from 'next'

export function getDefaultMetadata(metadata?: Metadata): Metadata {
  const { openGraph, twitter, ...rest } = metadata ?? {}

  return {
    title: 'L2BEAT - The state of the layer two ecosystem',
    description:
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
    metadataBase: new URL('https://l2beat.com'),
    openGraph: {
      type: 'website',
      siteName: 'L2BEAT',
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitter,
    },
    ...rest,
  }
}

export function getProjectMetadata(opts: {
  project: {
    name: string
    description: string
  }
  metadata?: Metadata
}): Metadata {
  return getDefaultMetadata({
    title: `${opts.project.name} - L2BEAT`,
    description: opts.project.description,
    ...opts.metadata,
  })
}
