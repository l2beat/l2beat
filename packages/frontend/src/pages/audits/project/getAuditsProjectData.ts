import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getAuditsProjectDetails } from '~/server/features/audits/getAuditsProjectDetails'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getAuditsProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, details] = await Promise.all([
    getAppLayoutProps(),
    getAuditsProjectDetails(slug),
  ])
  if (!details) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${details.name} - Audit coverage - L2BEAT`,
        description: `Deployed vs audited source comparison for ${details.name}.`,
        url,
        openGraph: {
          image: '/meta-images/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'AuditsProjectPage',
      props: {
        ...appLayoutProps,
        details,
        // Unit sources and diffs are fetched through tRPC on demand.
        queryState: helpers.dehydrate(),
      },
    },
  }
}
