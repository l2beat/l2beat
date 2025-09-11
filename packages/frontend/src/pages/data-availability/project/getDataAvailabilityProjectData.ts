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
import type { SsrHelpers } from '~/trpc/server'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

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
        openGraph: {
          url,
          image: `/meta-images/data-availability/projects/${params.layer}/opengraph-image.png`,
        },
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
      'isUpcoming',
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

    const entry = await getEthereumDaProjectEntry(helpers, layer, bridge)

    return entry
  }

  const entry = await getDaProjectEntry(helpers, layer, params.bridge)
  if (!entry) return

  return entry
}
