import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export function getDaRiskFrameworkData(
  manifest: Manifest,
  url: string,
): RenderData {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Risk Framework - L2BEAT',
        openGraph: {
          url,
        },
      }),
    },
    ssr: {
      page: 'DaRiskFrameworkPage',
      props: undefined,
    },
  }
}
