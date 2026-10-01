import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getDaProjectEntry,
  getEthereumDaProjectEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getDaMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getDaProjectPagePath,
  renderDaProjectMarkdown,
} from './renderDaProjectMarkdown'

interface DaProjectPageParams {
  layer: string
  bridge: string
}

export async function getDataAvailabilityProjectData(
  params: DaProjectPageParams,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await getCachedDaProjectPage(params, manifest, cache)
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'DataAvailabilityProjectPage',
      props: data.props,
    },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getDataAvailabilityProjectMarkdown(
  params: DaProjectPageParams,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedDaProjectPage(params, manifest, cache)
  return data && renderDaProjectMarkdown(data.props.entry)
}

function getCachedDaProjectPage(
  params: DaProjectPageParams,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['data-availability', 'projects', params.layer, params.bridge],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadDaProjectPage(manifest, params),
  )
}

async function loadDaProjectPage(
  manifest: Manifest,
  params: DaProjectPageParams,
) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getProjectEntry(params),
  ])
  if (!projectEntry) return undefined

  // From the params, not the request URL: the cache entry is shared by every
  // request for the page, including the .md one.
  const path = getDaProjectPagePath(params.layer, params.bridge)
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${projectEntry.name} - L2BEAT`,
        description: getDaMetadataDescription({
          name: projectEntry.name,
          bridge:
            projectEntry.entryType === 'common'
              ? projectEntry.selectedBridge
              : undefined,
          tvs: projectEntry.header.tvs,
          economicSecurity: projectEntry.header.economicSecurity,
          description: projectEntry.description,
        }),
        url: path,
        openGraph: {
          image: `/meta-images/data-availability/projects/${params.layer}/opengraph-image.png`,
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry: projectEntry,
      queryState: helpers.dehydrate(),
    },
  }
}

async function getProjectEntry(params: DaProjectPageParams) {
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

    const entry = await getEthereumDaProjectEntry(layer, bridge)

    return entry
  }

  const entry = await getDaProjectEntry(layer, params.bridge)
  if (!entry) return

  return entry
}
