import { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'
import type { Manifest } from '~/utils/Manifest'

import { ps } from '~/server/projects'

export async function getDataAvailabilityProjectData(
  manifest: Manifest,
  params: {
    layer: string
    bridge: string
  },
): Promise<RenderData | undefined> {
  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getProjectEntry(params),
  ])
  if (!projectEntry) return undefined

  return {
    head: {
      manifest,
      title: `${projectEntry.name} - L2BEAT`,
      description: projectEntry.description,
    },
    ssr: {
      page: 'DataAvailabilityProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
      },
    },
  }
}

async function getProjectEntry(params: { layer: string; bridge: string }) {
  const layer = await ps.getProject({
    slug: params.layer,
    select: ['daLayer', 'display', 'statuses'],
    optional: ['isUpcoming', 'milestones'],
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

    return getEthereumDaProjectEntry(layer, bridge)
  }

  const entry = await getDaProjectEntry(layer, params.bridge)
  if (!entry) return

  return entry
}
