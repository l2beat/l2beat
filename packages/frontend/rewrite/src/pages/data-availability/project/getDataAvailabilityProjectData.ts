import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/types'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'
import type { Manifest } from '~/utils/Manifest'

import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import { ps } from '~/server/projects'
import type { ExpressHelpers } from '~/trpc/server'
import { getExpressHelpers } from '~/trpc/server'

export async function getDataAvailabilityProjectData(
  manifest: Manifest,
  params: {
    layer: string
    bridge: string
  },
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getExpressHelpers()
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
        description: projectEntry.description,
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
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}

async function getProjectEntry(
  params: { layer: string; bridge: string },
  helpers: ExpressHelpers,
) {
  const layer = await ps.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'statuses'],
    optional: ['isUpcoming', 'milestones'],
  })

  if (!layer) return

  await Promise.all([
    helpers.da.projectChart.prefetch({
      range: 'max',
      projectId: layer.id,
    }),
    helpers.da.projectChartByProject.prefetch({
      range: '30d',
      daLayer: layer.id,
    }),
  ])

  if (layer.id === ProjectId.ETHEREUM) {
    const bridge = await ps.getProject({
      slug: params.bridge,
      select: ['daBridge', 'display'],
      optional: ['contracts', 'permissions'],
    })
    if (!bridge || bridge.id !== layer.id) {
      return
    }

    return getEthereumDaProjectEntry(layer, bridge)
  }

  const entry = await getDaProjectEntry(layer, params.bridge)
  if (!entry) return

  return entry
}
