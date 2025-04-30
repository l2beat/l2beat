import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingDataAvailabilityData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingDaEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'ScalingDataAvailabilityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
