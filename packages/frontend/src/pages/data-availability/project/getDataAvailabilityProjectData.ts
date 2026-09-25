import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers, type SsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getChartJsonAlternates } from '~/utils/project/chart-figures/chartJsonLinks'

export async function getDataAvailabilityProjectData(
  manifest: Manifest,
  params: {
    layer: string
    bridge: string
  },
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getProjectEntry(params, helpers),
  ])
  if (!projectEntry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${projectEntry.name} - L2BEAT`,
        description: getProjectMetadataDescription({
          name: projectEntry.name,
          display: {
            description: projectEntry.description,
          },
        }),
        url,
        openGraph: {
          image: `/meta-images/data-availability/projects/${params.layer}/opengraph-image.png`,
        },
        jsonAlternates: getChartJsonAlternates(
          projectEntry.name,
          projectEntry.sections,
        ),
      }),
    },
    ssr: {
      page: 'DataAvailabilityProjectPage',
      props: {
        ...appLayoutProps,
        entry: projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}

async function getProjectEntry(
  params: { layer: string; bridge: string },
  helpers: SsrHelpers,
) {
  const layer = await ps.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'statuses'],
    optional: [
      'milestones',
      'archivedAt',
      'colors',
      'trackedTxsConfig',
      'livenessConfig',
    ],
  })

  if (!layer) return

  if (layer.id === ProjectId.ETHEREUM) {
    const bridge = await ps.getProject({
      slug: params.bridge,
      select: ['daBridge', 'display'],
      optional: ['contracts', 'permissions'],
    })
    if (!bridge || bridge.id !== layer.id) {
      return
    }

    const entry = await getEthereumDaProjectEntry(layer, bridge, helpers)

    return entry
  }

  const entry = await getDaProjectEntry(layer, params.bridge, helpers)
  if (!entry) return

  return entry
}
