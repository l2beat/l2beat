import type { InMemoryCache } from '@l2beat/shared-pure'
import {
  getDefiProjectEntry,
  type ProjectDefiEntry,
} from '~/server/features/defi/project/getDefiProjectEntry'
import { getDefiProjectTotalValueLocked } from '~/server/features/defi/project/getDefiProjectTotalValueLocked'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { getProjectMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../../project/getProjectData'
import { renderDefiProjectMarkdown } from './renderDefiProjectMarkdown'

export async function getDefiProjectContent(
  page: ProjectPage,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'DefiProjectPage'> | undefined> {
  const entry = await getDefiProjectEntry(page.slug, helpers)
  if (!entry) return undefined

  return {
    props: { entry },
    metadata: {
      name: entry.name,
      title: `${entry.name} - DeFi - ETHBEAT`,
      description: getProjectMetadataDescription(entry),
    },
  }
}

/**
 * The TVL is queried apart from the page: the HTML page only charts it in the
 * browser, so its render should not pay for the query.
 */
export async function getDefiProjectMarkdown(
  props: { entry: ProjectDefiEntry },
  page: ProjectPage,
  cache: InMemoryCache,
): Promise<string> {
  const totalValueLockedUsd = await cache.get(
    {
      key: ['defi', 'projects', page.slug, 'tvl'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getDefiProjectTotalValueLocked(page.slug),
  )
  return renderDefiProjectMarkdown(props.entry, totalValueLockedUsd)
}
