import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getChainProjectEntry } from '~/server/features/chains/getChainProjectEntry'
import {
  getProjectBreadcrumbs,
  type ProjectPage,
} from '~/server/features/projects/getProjectPage'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'

export async function getChainProjectData(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['projects', 'chain', page.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => loadChainProjectPage(manifest, page),
  )
  if (!data) return undefined
  return {
    head: data.head,
    ssr: {
      page: 'ChainProjectPage',
      props: data.props,
    },
  }
}

async function loadChainProjectPage(manifest: Manifest, page: ProjectPage) {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entry] = await Promise.all([
    getAppLayoutProps(),
    getChainProjectEntry(page.slug, helpers),
  ])
  if (!entry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: entry.name,
        description: `Cross-chain volume and flows of ${entry.name}: the interop protocols and tokens moving value between ${entry.name} and other chains.`,
        url: getProjectPath(entry.slug),
        // Chain pages show only interop flows, which have no markdown version.
        hasMarkdown: false,
        openGraph: {
          image: getProjectOgImagePath(entry.slug),
        },
      }),
    },
    props: {
      ...appLayoutProps,
      entry,
      projectSections: getProjectBreadcrumbs(page),
      queryState: helpers.dehydrate(),
    },
  }
}
