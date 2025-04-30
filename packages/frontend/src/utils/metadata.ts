import type { Metadata } from 'next'

// This function is to be used in REWRITE, will be deleted when REWRITE is over
export function getPureDefaultMetadata(props?: {
  title?: string
  description?: string
}): { title: string; description: string } {
  return {
    title: props?.title ?? 'L2BEAT - The state of the layer two ecosystem',
    description:
      props?.description ??
      'L2BEAT is an analytics and research website about Ethereum layer 2 scaling. Here you will find in depth comparison of major protocols live on Ethereum today.',
  }
}

export function getDefaultMetadata(metadata?: Metadata): Metadata {
  const { openGraph, twitter, ...rest } = metadata ?? {}

  return {
    ...getPureDefaultMetadata({
      title: metadata?.title as string | undefined,
      description: metadata?.description as string | undefined,
    }),
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
