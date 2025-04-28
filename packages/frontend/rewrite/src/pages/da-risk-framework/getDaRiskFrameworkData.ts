import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'

export function getDaRiskFrameworkData(manifest: Manifest): RenderData {
  return {
    head: {
      manifest,
      title: 'L2BEAT - Data Availability Risk Framework',
      description: 'L2BEAT - Data Availability Risk Framework',
    },
    ssr: {
      page: 'DaRiskFrameworkPage',
      props: undefined,
    },
  }
}
