import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingTvsEntries(),
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
      page: 'ScalingTvsPage',
      props: {
        ...appLayoutProps,
        entries,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}
