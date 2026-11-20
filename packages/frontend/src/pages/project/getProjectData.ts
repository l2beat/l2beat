import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  getProjectBreadcrumbs,
  type ProjectPage,
  type ProjectPageKind,
} from '~/server/features/projects/getProjectPage'
import { getProjectVersionLinks } from '~/server/features/projects/getProjectVersionLinks'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getProjectPath } from '~/utils/project/getProjectPath'
import { chainProjectPage } from '../chain/getChainProjectContent'
import { defiProjectPage } from '../defi/project/getDefiProjectContent'
import { ethereumProjectPage } from '../ethereum/getEthereumProjectContent'
import { interopChainProtocolPage } from '../interop/protocol/getInteropChainProtocolContent'
import { interopProtocolPage } from '../interop/protocol/getInteropProtocolContent'
import { l2PrivacyProjectPage } from '../layer2s/project/getL2PrivacyProjectContent'
import { l2ProjectPage } from '../layer2s/project/getL2ProjectContent'
import type { SsrData } from '../pageTypes'
import { privacyProjectPage } from '../privacy/project/getPrivacyProjectContent'
import { privacyZkCatalogProjectPage } from '../privacy/project/getPrivacyZkCatalogProjectContent'
import { zkCatalogProjectPage } from '../zk-catalog/v2/project/getZkCatalogProjectContent'
import type { ProjectPageCommonProps } from './ProjectPage'
import type { ProjectPageDefinition } from './projectPageDefinition'

/** The page at `/projects/{slug}`, or undefined when it has nothing to show. */
export async function getProjectData(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
  selectedUpdateId?: string,
): Promise<RenderData | undefined> {
  const data = await getCachedProjectPage(page, manifest, cache)
  if (!data) return undefined
  return {
    head: data.head,
    ssr: {
      page: PROJECT_PAGES[page.kind].component,
      props: { ...data.props, selectedUpdateId },
    } as SsrData,
  }
}

/** The markdown alternate of the page, from the same cached props as the HTML. */
export async function getProjectMarkdown(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedProjectPage(page, manifest, cache)
  return (
    data &&
    PROJECT_PAGES[page.kind].renderMarkdown(data.props, {
      slug: page.slug,
      cache,
    })
  )
}

function getCachedProjectPage(
  page: ProjectPage,
  manifest: Manifest,
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: ['projects', page.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    async () => {
      const helpers = getSsrHelpers()
      const [appLayoutProps, versionLinks, content] = await Promise.all([
        getAppLayoutProps(),
        getProjectVersionLinks(page.slug),
        PROJECT_PAGES[page.kind].getContent(page.slug, { helpers, manifest }),
      ])
      if (!content) return undefined

      const props: ProjectPageCommonProps = {
        ...appLayoutProps,
        ...content.props,
        projectSections: getProjectBreadcrumbs(page),
        versionLinks,
        queryState: helpers.dehydrate(),
      }
      return {
        head: {
          manifest,
          metadata: getMetadata(manifest, {
            ...content.metadata,
            // From the slug, not the request URL: the cache entry is shared
            // by every request for the project, the .md one included.
            url: getProjectPath(page.slug),
            openGraph: { image: getOgImagePath(page) },
          }),
        },
        props,
      }
    },
  )
}

/**
 * Each section has its own image of the project: the page shows the one of
 * the section it is built on.
 */
function getOgImagePath(page: ProjectPage) {
  const section = page.sections[0]
  switch (section) {
    case 'ethereum':
      return '/meta-images/projects/ethereum/opengraph-image.png'
    case 'chain':
      return '/meta-images/interop/summary/opengraph-image.png'
    case 'zkCatalog':
      return `/meta-images/zk-catalog/projects/${page.slug}/opengraph-image.png`
    default:
      return `/meta-images/${section}/projects/${page.slug}/opengraph-image.png`
  }
}

/** The page of every kind in `PROJECT_PAGE_KINDS`. */
const PROJECT_PAGES: Record<ProjectPageKind, ProjectPageDefinition> = {
  ethereum: ethereumProjectPage,
  layer2s: l2ProjectPage,
  layer2sPrivacy: l2PrivacyProjectPage,
  interop: interopProtocolPage,
  interopChain: interopChainProtocolPage,
  chain: chainProjectPage,
  zkCatalog: zkCatalogProjectPage,
  privacy: privacyProjectPage,
  privacyZkCatalog: privacyZkCatalogProjectPage,
  defi: defiProjectPage,
}
