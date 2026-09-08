import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getAuditsSummaryEntries } from '~/server/features/audits/getAuditsSummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getAuditsSummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getAuditsSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Audits - L2BEAT',
        description:
          'How much of the smart contract code deployed by each project is covered by public audits.',
        url,
        openGraph: {
          image: '/meta-images/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'AuditsSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
