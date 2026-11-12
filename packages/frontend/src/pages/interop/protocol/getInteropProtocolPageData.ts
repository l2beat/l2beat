import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getChainFlowsSection } from '~/server/features/chains/getChainProjectEntry'
import { getInteropProtocolData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import { getInteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import {
  getProjectBreadcrumbs,
  type ProjectPage,
} from '~/server/features/projects/getProjectPage'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getInteropMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import { renderInteropProtocolMarkdown } from './renderInteropProtocolMarkdown'

export async function getInteropProtocolPageData(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    getCachedInteropProtocolPage(page, manifest, cache),
  ])

  if (!data) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: data.project.name,
        description: data.project.metaDescription,
        url: getProjectPath(data.project.slug),
        openGraph: {
          image: getProjectOgImagePath(data.project.slug),
        },
      }),
    },
    ssr: {
      page: 'InteropProtocolPage',
      props: {
        ...appLayoutProps,
        projectEntry: data.projectEntry,
        projectSections: data.projectSections,
        versionLinks: data.versionLinks,
        protocolData: data.protocolData,
        apiSelection: data.apiSelection,
        selectedUpdateId,
        queryState: data.queryState,
      },
    },
  }
}

/** The markdown alternate of the page, built from the same cached data as the HTML. */
export async function getInteropProtocolMarkdown(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedInteropProtocolPage(page, manifest, cache)
  return data && renderInteropProtocolMarkdown(data)
}

function getCachedInteropProtocolPage(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['interop', 'protocols', page.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadInteropProtocolPage(page, manifest),
  )
}

async function loadInteropProtocolPage(page: ProjectPage, manifest: Manifest) {
  const { slug } = page
  const helpers = getSsrHelpers()
  const interopChains = getInteropChains()
  const liveChainIds = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const apiSelection = { from: liveChainIds, to: liveChainIds }

  const project = await ps.getProject({
    slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display', 'discoveryUpdates', 'discoveryInfo'],
  })
  if (!project) return undefined

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains.filter((chain) => !chain.isUpcoming),
  )

  const [protocolData, versionLinks, chainFlows] = await Promise.all([
    getInteropProtocolData({ id: project.id, ...apiSelection }),
    getProjectVersionLinks(slug),
    page.sections.includes('chain')
      ? getChainFlowsSection(slug, helpers)
      : undefined,
  ])

  const projectEntry = await getInteropProtocolEntry(
    project,
    apiSelection,
    interopChainsWithIcons,
    protocolData,
    helpers,
    chainFlows,
  )

  return {
    project: {
      name: project.name,
      slug: project.slug,
      metaDescription: getInteropMetadataDescription({
        name: project.name,
        type: project.interopConfig.type,
        description: project.interopConfig.description,
      }),
    },
    projectEntry,
    projectSections: getProjectBreadcrumbs(page),
    versionLinks,
    protocolData,
    apiSelection,
    queryState: helpers.dehydrate(),
  }
}
