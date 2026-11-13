import type { InMemoryCache } from '@l2beat/shared-pure'
import {
  getDefiProjectEntry,
  type ProjectDefiEntry,
} from '~/server/features/defi/project/getDefiProjectEntry'
import { getDefiProjectTotalValueLocked } from '~/server/features/defi/project/getDefiProjectTotalValueLocked'
import { getProjectMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { renderDefiProjectMarkdown } from './renderDefiProjectMarkdown'

export const defiProjectPage: ProjectPageDefinition<'DefiProjectPage'> = {
  component: 'DefiProjectPage',
  getContent: getDefiProjectContent,
  renderMarkdown: getDefiProjectMarkdown,
}

async function getDefiProjectContent(
  slug: string,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'DefiProjectPage'> | undefined> {
  const entry = await getDefiProjectEntry(slug, helpers)
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
async function getDefiProjectMarkdown(
  props: { entry: ProjectDefiEntry },
  { slug, cache }: { slug: string; cache: InMemoryCache },
): Promise<string> {
  const totalValueLockedUsd = await cache.get(
    {
      key: ['defi', 'projects', slug, 'tvl'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getDefiProjectTotalValueLocked(slug),
  )
  return renderDefiProjectMarkdown(props.entry, totalValueLockedUsd)
}
