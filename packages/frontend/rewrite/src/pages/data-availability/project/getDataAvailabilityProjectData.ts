import { ProjectId } from '@l2beat/shared-pure'
import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'

import { ps } from '~/server/projects'

export async function getDataAvailabilityProjectData(
  manifest: Manifest,
  params: {
    layer: string
    bridge: string
  },
): Promise<RenderData | undefined> {
  const [searchBarProjects, projectEntry] = await Promise.all([
    getSearchBarProjects(),
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
        projectEntry,
        searchBarProjects,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
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
