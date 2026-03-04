import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getChangelogEntries } from '~/server/features/changelog/getChangelogEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { formatPublicationDate } from '~/utils/dates'
import type { Manifest } from '~/utils/Manifest'

export async function getChangelogData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps(req)
  const entries = getChangelogEntries().map((entry) => ({
    id: entry.id,
    title: entry.title,
    summary: entry.summary,
    publishedOn: formatPublicationDate(entry.publishedAt),
    content: entry.content,
  }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Changelog - L2BEAT',
        description:
          'Track product and content updates shipped on L2BEAT in one place.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/changelog/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ChangelogPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
