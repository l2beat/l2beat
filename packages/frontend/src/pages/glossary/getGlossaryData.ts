import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGlossaryData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps(req)
  const glossaryEntries = getCollection('glossary')

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Glossary - L2BEAT',
        description:
          'Understand key terms in Ethereum’s scaling ecosystem with L2BEAT’s glossary.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/glossary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'GlossaryPage',
      props: {
        ...appLayoutProps,
        glossaryEntries,
      },
    },
  }
}
