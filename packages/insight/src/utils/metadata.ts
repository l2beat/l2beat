import { type Metadata } from 'next'

export function getDefaultMetadata(metadata?: Metadata): Metadata {
  const { openGraph, twitter, ...rest } = metadata ?? {}

  return {
    title: 'Insight by L2BEAT',
    description: 'Get insights about your L2 assets.',
    metadataBase: new URL('https://insight.l2beat.com'),
    openGraph: {
      type: 'website',
      siteName: 'Insight',
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitter,
    },
    ...rest,
  }
}
