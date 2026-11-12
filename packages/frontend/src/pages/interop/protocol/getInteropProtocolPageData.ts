import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getChainProjectEntry } from '~/server/features/chains/getChainProjectEntry'
import { getInteropProtocolData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import { getInteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { getProjectSections } from '~/server/features/projects/getProjectSections'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { mergeProjectSections } from '~/server/features/projects/mergeProjectSections'
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
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    getCachedInteropProtocolPage(req.params.slug, manifest, cache),
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
        selectedUpdateId: req.query.update,
        queryState: data.queryState,
      },
    },
  }
}

/** The markdown alternate of the page, built from the same cached data as the HTML. */
export async function getInteropProtocolMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedInteropProtocolPage(slug, manifest, cache)
  return data && renderInteropProtocolMarkdown(data)
}

function getCachedInteropProtocolPage(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['interop', 'protocols', slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadInteropProtocolPage(slug, manifest),
  )
}

async function loadInteropProtocolPage(slug: string, manifest: Manifest) {
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

  const [protocolData, projectSections, versionLinks] = await Promise.all([
    getInteropProtocolData({ id: project.id, ...apiSelection }),
    getProjectSections(slug),
    getProjectVersionLinks(slug),
  ])

  const [projectEntry, chainEntry] = await Promise.all([
    getInteropProtocolEntry(
      project,
      apiSelection,
      interopChainsWithIcons,
      protocolData,
      helpers,
    ),
    // A protocol that is also a chain with a page of its own, e.g. Avalanche.
    getChainProjectEntry(slug, helpers),
  ])
  if (chainEntry) {
    // The chain's flows cover every protocol, this one included (its
    // canonical bridge button picks it), so they replace the protocol's own.
    projectEntry.sections = mergeProjectSections(
      projectEntry.sections,
      chainEntry.sections.flatMap((section): ProjectDetailsSection[] =>
        section.type === 'InteropFlowsSection'
          ? [
              {
                ...section,
                props: {
                  ...section.props,
                  title: 'Volume and flows',
                  aliasIds: ['interop-volume'],
                },
              },
            ]
          : [],
      ),
      { insertAfterId: 'interop-volume' },
    ).filter((section) => section.props.id !== 'interop-volume')
  }

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
    projectSections,
    versionLinks,
    protocolData,
    apiSelection,
    queryState: helpers.dehydrate(),
  }
}
