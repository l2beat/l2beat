import type { InMemoryCache } from '@l2beat/shared-pure'
import type { DehydratedState } from '@tanstack/react-query'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectSection } from '~/components/projects/projectSections'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import {
  getProjectBreadcrumbs,
  hasMarkdown,
  type KindWithoutMarkdown,
  type ProjectPage,
  type ProjectPageKind,
  type ProjectPageWithMarkdown,
} from '~/server/features/projects/getProjectPage'
import {
  getProjectVersionLinks,
  type ProjectVersionLinks,
} from '~/server/features/projects/getProjectVersionLinks'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers, type SsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectOgImagePath,
  getProjectPath,
} from '~/utils/project/getProjectPath'
import { getChainProjectContent } from '../chain/getChainProjectContent'
import {
  getDefiProjectContent,
  getDefiProjectMarkdown,
} from '../defi/project/getDefiProjectContent'
import { getEthereumProjectContent } from '../ethereum/getEthereumProjectContent'
import { renderEthereumProjectMarkdown } from '../ethereum/renderEthereumProjectMarkdown'
import { getInteropProtocolContent } from '../interop/protocol/getInteropProtocolContent'
import { renderInteropProtocolMarkdown } from '../interop/protocol/renderInteropProtocolMarkdown'
import {
  getL2PrivacyProjectContent,
  getL2ProjectContent,
} from '../layer2s/project/getL2ProjectContent'
import { renderL2ProjectMarkdown } from '../layer2s/project/renderL2ProjectMarkdown'
import type { PageName, Pages, SsrData } from '../pageTypes'
import { getPrivacyProjectContent } from '../privacy/project/getPrivacyProjectContent'
import { renderPrivacyProjectMarkdown } from '../privacy/project/renderPrivacyProjectMarkdown'
import { getZkCatalogProjectContent } from '../zk-catalog/v2/project/getZkCatalogProjectContent'
import { renderZkCatalogProjectMarkdown } from '../zk-catalog/v2/project/renderZkCatalogProjectMarkdown'

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
  page: ProjectPageWithMarkdown,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedProjectPage(page, manifest, cache)
  return data && PROJECT_PAGES[page.kind].renderMarkdown(data.props, page, cache)
}

/** What every project page gets, whatever its kind. */
interface CommonProps extends AppLayoutProps {
  projectSections: ProjectSection[]
  versionLinks?: ProjectVersionLinks
  queryState: DehydratedState
  selectedUpdateId?: string
}

/** What one kind of project page adds to that: its own props and metadata. */
export interface ProjectPageContent<Name extends PageName> {
  props: Omit<Parameters<Pages[Name]>[0], keyof CommonProps>
  metadata: Pick<
    Parameters<typeof getMetadata>[1],
    'name' | 'title' | 'description' | 'structuredData'
  >
}

export interface ProjectPageContext {
  helpers: SsrHelpers
  manifest: Manifest
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
        PROJECT_PAGES[page.kind].getContent(page, { helpers, manifest }),
      ])
      if (!content) return undefined

      const props: CommonProps = {
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
            openGraph: { image: getProjectOgImagePath(page.slug) },
            hasMarkdown: hasMarkdown(page),
          }),
        },
        props,
      }
    },
  )
}

interface PageKind {
  component: PageName
  getContent(
    page: ProjectPage,
    context: ProjectPageContext,
  ): Promise<ProjectPageContent<PageName> | undefined>
}

interface PageKindWithMarkdown extends PageKind {
  renderMarkdown(
    props: object,
    page: ProjectPage,
    cache: InMemoryCache,
  ): string | Promise<string>
}

/** Checks a kind's parts against its component's props, then forgets which. */
function pageKind<Name extends PageName>(kind: {
  component: Name
  getContent(
    page: ProjectPage,
    context: ProjectPageContext,
  ): Promise<ProjectPageContent<Name> | undefined>
  renderMarkdown(
    props: ProjectPageContent<Name>['props'],
    page: ProjectPage,
    cache: InMemoryCache,
  ): string | Promise<string>
}): PageKindWithMarkdown {
  return kind as PageKindWithMarkdown
}

/** Each kind of project page: its component, and what only it knows. */
const PROJECT_PAGES: {
  [Kind in ProjectPageKind]: Kind extends KindWithoutMarkdown
    ? PageKind
    : PageKindWithMarkdown
} = {
  ethereum: pageKind({
    component: 'EthereumProjectPage',
    getContent: getEthereumProjectContent,
    renderMarkdown: (props) => renderEthereumProjectMarkdown(props.entry),
  }),
  layer2s: pageKind({
    component: 'L2ProjectPage',
    getContent: getL2ProjectContent,
    renderMarkdown: (props) => renderL2ProjectMarkdown(props.projectEntry),
  }),
  layer2sPrivacy: pageKind({
    component: 'L2PrivacyProjectPage',
    getContent: getL2PrivacyProjectContent,
    renderMarkdown: (props) => renderL2ProjectMarkdown(props.projectEntry),
  }),
  interop: pageKind({
    component: 'InteropProtocolPage',
    getContent: getInteropProtocolContent,
    renderMarkdown: renderInteropProtocolMarkdown,
  }),
  chain: {
    component: 'ChainProjectPage',
    getContent: getChainProjectContent,
  },
  zkCatalog: pageKind({
    component: 'ZkCatalogProjectPage',
    getContent: getZkCatalogProjectContent,
    renderMarkdown: (props) =>
      renderZkCatalogProjectMarkdown(props.projectEntry),
  }),
  privacy: pageKind({
    component: 'PrivacyProjectPage',
    getContent: getPrivacyProjectContent,
    renderMarkdown: (props) => renderPrivacyProjectMarkdown(props.entry),
  }),
  defi: pageKind({
    component: 'DefiProjectPage',
    getContent: getDefiProjectContent,
    renderMarkdown: getDefiProjectMarkdown,
  }),
}
