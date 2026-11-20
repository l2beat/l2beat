import type { InMemoryCache } from '@l2beat/shared-pure'
import type { getMetadata } from '~/ssr/head/getMetadata'
import type { SsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import type { PageName, Pages } from '../pageTypes'
import type { ProjectPageCommonProps } from './ProjectPage'

/**
 * One kind of project page: its component, and what only it knows. The
 * loader in `getProjectData` adds what every project page has.
 */
export interface ProjectPageDefinition<Name extends PageName = PageName> {
  component: Name
  /** Undefined when the project has nothing to show. */
  getContent(
    slug: string,
    context: ProjectPageContext,
  ): Promise<ProjectPageContent<Name> | undefined>
  /** The page as markdown, from the props the HTML page renders. */
  renderMarkdown(
    props: ProjectPageContent<Name>['props'],
    context: { slug: string; cache: InMemoryCache },
  ): string | Promise<string>
}

/** The props and metadata of a page that only its kind knows. */
export interface ProjectPageContent<Name extends PageName> {
  props: Omit<Parameters<Pages[Name]>[0], keyof ProjectPageCommonProps>
  metadata: Pick<
    Parameters<typeof getMetadata>[1],
    'name' | 'title' | 'description' | 'structuredData'
  >
}

export interface ProjectPageContext {
  helpers: SsrHelpers
  manifest: Manifest
}
