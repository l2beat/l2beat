import { type InMemoryCache, ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getEthereumProjectEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getDaMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers, type SsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { ETHEREUM_PROJECT_PATH } from './paths'
import { renderEthereumProjectMarkdown } from './renderEthereumProjectMarkdown'

export async function getEthereumProjectData(
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const data = await getCachedEthereumProjectPage(manifest, cache)
  return {
    head: data.head,
    ssr: {
      page: 'EthereumProjectPage',
      props: data.props,
    },
  }
}

/** The markdown alternate of the page, built from the same cached entry as the HTML. */
export async function getEthereumProjectMarkdown(
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string> {
  const data = await getCachedEthereumProjectPage(manifest, cache)
  return renderEthereumProjectMarkdown(data.props.entry)
}

function getCachedEthereumProjectPage(
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['projects', 'ethereum'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadEthereumProjectPage(manifest),
  )
}

async function loadEthereumProjectPage(manifest: Manifest) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getEntry(helpers),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: entry.name,
        description: getDaMetadataDescription({
          name: entry.name,
          tvs: entry.header.tvs,
          economicSecurity: entry.header.economicSecurity,
          description: entry.description,
        }),
        url: ETHEREUM_PROJECT_PATH,
        openGraph: {
          image: '/meta-images/projects/ethereum/opengraph-image.png',
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry,
      queryState: helpers.dehydrate(),
    },
  }
}

async function getEntry(helpers: SsrHelpers) {
  const project = await ps.getProject({
    id: ProjectId.ETHEREUM,
    select: ['daLayer', 'daBridge', 'display', 'statuses'],
    optional: ['milestones', 'contracts', 'permissions'],
  })
  if (!project) {
    throw new Error('Ethereum project not found')
  }
  return getEthereumProjectEntry(project, helpers)
}
