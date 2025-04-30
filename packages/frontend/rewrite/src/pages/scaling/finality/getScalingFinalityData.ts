import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingFinalityEntries } from '~/server/features/scaling/finality/get-scaling-finality-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingFinalityData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingFinalityEntries(),
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
      page: 'ScalingFinalityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
