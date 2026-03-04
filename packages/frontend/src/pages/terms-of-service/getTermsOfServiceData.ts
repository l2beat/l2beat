import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { formatPublicationDate } from '~/utils/dates'
import type { Manifest } from '../../utils/Manifest'

export async function getTermsOfServiceData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps(req)
  const content = getCollectionEntry('pages', 'terms-of-service')
  if (!content) {
    return undefined
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Terms of Service - L2BEAT',
        description: 'Terms of Service for L2BEAT.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/terms-of-service/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'TermsOfServicePage',
      props: {
        ...appLayoutProps,
        content,
        lastUpdated: formatPublicationDate(content.data.lastUpdated),
      },
    },
  }
}
