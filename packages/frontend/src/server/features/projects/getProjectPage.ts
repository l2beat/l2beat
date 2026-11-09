import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { getChainProjects } from '../chains/getChainProjects'

/** A kind of page a project has content for under `/projects/{slug}`. */
export type ProjectPageSection =
  | 'ethereum'
  | 'layer2s'
  | 'interop'
  | 'chain'
  | 'zkCatalog'
  | 'privacy'
  | 'defi'

/**
 * Every combination of sections a project page can show, keyed by the sorted
 * sections. The value is the base page the others are merged into. A project
 * with a combination missing here has no page until someone designs it.
 */
const PAGE_KINDS: Record<string, ProjectPageSection> = {
  ethereum: 'ethereum',
  layer2s: 'layer2s',
  interop: 'interop',
  chain: 'chain',
  zkCatalog: 'zkCatalog',
  privacy: 'privacy',
  defi: 'defi',
  'privacy+zkCatalog': 'privacy',
  'layer2s+privacy': 'layer2s',
  'chain+interop': 'interop',
}

type SectionFields = Project<
  never,
  'scalingInfo' | 'interopConfig' | 'zkCatalogInfo' | 'privacyInfo' | 'defiInfo'
>

export const PROJECT_PAGE_SECTION_FIELDS = [
  'scalingInfo',
  'interopConfig',
  'zkCatalogInfo',
  'privacyInfo',
  'defiInfo',
] as const

/** The sections a project shows, in the order of `ProjectPageSection`. */
export function getProjectPageSections(
  project: Pick<
    SectionFields,
    'id' | (typeof PROJECT_PAGE_SECTION_FIELDS)[number]
  >,
  options: { hasChainPage: boolean; defiEnabled: boolean },
): ProjectPageSection[] {
  const sections: (ProjectPageSection | false | undefined)[] = [
    project.id === ProjectId.ETHEREUM && 'ethereum',
    !!project.scalingInfo && 'layer2s',
    !!project.interopConfig && !project.scalingInfo && 'interop',
    options.hasChainPage && 'chain',
    !!project.zkCatalogInfo && 'zkCatalog',
    !!project.privacyInfo && 'privacy',
    options.defiEnabled && !!project.defiInfo && 'defi',
  ]
  return sections.filter((section) => !!section)
}

/**
 * The page builder for these sections, or undefined when there is nothing to
 * show. Throws for a combination no page is designed for, so it gets one.
 */
export function getProjectPageKind(
  sections: ProjectPageSection[],
): ProjectPageSection | undefined {
  if (sections.length === 0) return undefined
  const kind = PAGE_KINDS[[...sections].sort().join('+')]
  if (!kind) {
    throw new Error('Unsupported project page sections', {
      cause: { sections },
    })
  }
  return kind
}

/**
 * The section whose page builder renders `/projects/{slug}` in this
 * deployment, or undefined for a 404. Chain pages without a project, like
 * Solana's, have only the chain section.
 */
export async function getProjectPage(
  slug: string,
): Promise<ProjectPageSection | undefined> {
  const [project, chainProjects] = await Promise.all([
    ps.getProject({ slug, optional: [...PROJECT_PAGE_SECTION_FIELDS] }),
    getChainProjects(),
  ])
  const hasChainPage = chainProjects.some((chain) => chain.slug === slug)
  if (!project) return hasChainPage ? 'chain' : undefined
  return getProjectPageKind(
    getProjectPageSections(project, {
      hasChainPage,
      // Ossification links to the pages of the DeFi projects it tracks.
      defiEnabled:
        env.CLIENT_SIDE_DEFI_ENABLED || env.CLIENT_SIDE_OSSIFICATION_ENABLED,
    }),
  )
}
