import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import {
  getPublicationEntryFromExternalPublication,
  getPublicationEntryFromGovernance,
  getPublicationEntryFromMonthlyUpdate,
} from './utils/getPublicationEntry'

export async function getPublicationsData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps(req)
  const governancePublications = getCollection('governance-publications')
  const monthlyUpdates = getCollection('monthly-updates')
  const externalPublications = getCollection('external-publications')

  const publications = governancePublications
    .map(getPublicationEntryFromGovernance)
    .concat(monthlyUpdates.map(getPublicationEntryFromMonthlyUpdate))
    .concat(
      externalPublications.map(getPublicationEntryFromExternalPublication),
    )
    .sort((a, b) => b.publishedOn - a.publishedOn)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Publications - L2BEAT',
        description:
          'Your hub for everything L2BEAT publishes: research, explainers, essays, interviews, and curated highlights on the evolving Layer 2 ecosystem.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/publications/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PublicationsPage',
      props: {
        ...appLayoutProps,
        publications,
        newsletterBgUrl: manifest.getUrl(
          '/images/publications/newsletter-box.png',
        ),
      },
    },
  }
}
