import { INTEROP_CHAINS, type Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { ProjectSection } from '~/components/projects/projectSections'
import { env } from '~/env'
import { ps } from '~/server/projects'
import {
  getChainProjectSlug,
  getChainProjects,
} from '../chains/getChainProjects'
import { hasDefiProjectPage } from '../defi/project/hasDefiProjectPage'
import { getActiveInteropChains } from '../layer2s/interop/utils/getInteropChains'

/** A kind of content a project has for its page at `/projects/{slug}`. */
export type ProjectPageSection =
  | 'ethereum'
  | 'layer2s'
  | 'interop'
  | 'chain'
  | 'zkCatalog'
  | 'privacy'
  | 'defi'

/** A scaling project that is also a privacy protocol has a page of its own. */
export type ProjectPageKind = ProjectPageSection | 'layer2sPrivacy'

/**
 * Every kind of project page that is designed: the sections a project must be
 * in to get it, and the ones the page also shows when the project is in them.
 * A project in a set of sections that fits none has no page until someone
 * designs it.
 */
const PAGE_KINDS: Record<ProjectPageKind, PageKind> = {
  ethereum: { sections: ['ethereum'] },
  layer2s: { sections: ['layer2s'] },
  layer2sPrivacy: { sections: ['layer2s', 'privacy'] },
  interop: { sections: ['interop'], alsoShows: ['chain'] },
  chain: { sections: ['chain'] },
  zkCatalog: { sections: ['zkCatalog'] },
  privacy: { sections: ['privacy'], alsoShows: ['zkCatalog'] },
  defi: { sections: ['defi'] },
}

interface PageKind {
  sections: ProjectPageSection[]
  alsoShows?: ProjectPageSection[]
}

/** Chain pages show only interop flows, which have no markdown version. */
export type KindWithoutMarkdown = 'chain'

export interface ProjectPage<Kind extends ProjectPageKind = ProjectPageKind> {
  slug: string
  kind: Kind
  /** Every section the page shows: the ones its kind needs first. */
  sections: ProjectPageSection[]
}

export type ProjectPageWithMarkdown = ProjectPage<
  Exclude<ProjectPageKind, KindWithoutMarkdown>
>

export function hasMarkdown(
  page: ProjectPage,
): page is ProjectPageWithMarkdown {
  return page.kind !== ('chain' satisfies KindWithoutMarkdown)
}

/** What a query has to select for the project's page to be known. */
export const PROJECT_PAGE_FIELDS = [
  'scalingInfo',
  'interopConfig',
  'zkCatalogInfo',
  'privacyInfo',
  'defiInfo',
  'ossificationHistory',
] as const

type PageField = (typeof PROJECT_PAGE_FIELDS)[number]
type PageProject = Pick<Project<never, PageField>, 'id' | 'slug' | PageField>

interface Deployment {
  hasChainPage: boolean
  /** Every flag on, for what must cover any deployment. */
  anyDeployment?: boolean
}

/**
 * The page at `/projects/{slug}` in this deployment, or undefined for a 404.
 * Chain pages without a project, like Solana's, have only the chain section.
 */
export async function getProjectPage(
  slug: string,
): Promise<ProjectPage | undefined> {
  const [project, chainProjects] = await Promise.all([
    ps.getProject({ slug, optional: [...PROJECT_PAGE_FIELDS] }),
    getChainProjects(),
  ])
  const sections = getSections(project, {
    hasChainPage: chainProjects.some((chain) => chain.slug === slug),
  })
  if (sections.length === 0) return undefined
  const kind = getPageKind(sections)
  // Loud, so that the page gets designed.
  if (!kind) throw unsupported(slug, sections)
  return toProjectPage(slug, kind, sections)
}

type InteropChain = (typeof INTEROP_CHAINS)[number]

/** A page with what it is about: a project, or a chain no section lists. */
export type ProjectPageEntry<P> =
  | (ProjectPage<'chain'> & { chain: InteropChain; project?: undefined })
  | (ProjectPage<Exclude<ProjectPageKind, 'chain'>> & {
      project: P
      /** The chain whose flows the page shows, if it has the chain section. */
      chain?: InteropChain
    })

/**
 * Every project page in this deployment. Takes all projects, not a selection:
 * which chains get a page of their own depends on which are scaling projects.
 *
 * A project in sections no page is designed for is left out, so that the
 * lists every page reads stay up; its own page throws. With `anyDeployment`
 * (every chain, every flag on) this throws for it instead: that is what the
 * tests and `pnpm og-images` run, before any deployment.
 */
export function selectProjectPages<P extends PageProject>(
  projects: P[],
  options: { anyDeployment?: boolean } = {},
): ProjectPageEntry<P>[] {
  const l2ProjectIds = new Set(
    projects.filter((p) => p.scalingInfo).map((p) => p.id),
  )
  const chains = new Map(
    (options.anyDeployment ? INTEROP_CHAINS : getActiveInteropChains()).flatMap(
      (chain) => {
        const slug = getChainProjectSlug(chain, l2ProjectIds)
        return slug ? [[slug, chain] as const] : []
      },
    ),
  )

  const entries: ProjectPageEntry<P>[] = []
  for (const project of projects) {
    const chain = chains.get(project.slug)
    const sections = getSections(project, {
      hasChainPage: chain !== undefined,
      anyDeployment: options.anyDeployment,
    })
    // The chain's own page, added below.
    if (sections.length === 1 && sections[0] === 'chain') continue
    chains.delete(project.slug)
    if (sections.length === 0) continue
    const kind = getPageKind(sections)
    if (!kind || kind === 'chain') {
      if (options.anyDeployment) throw unsupported(project.slug, sections)
      continue
    }
    entries.push({
      ...toProjectPage(project.slug, kind, sections),
      kind,
      project,
      chain,
    })
  }
  for (const [slug, chain] of chains) {
    entries.push({ slug, kind: 'chain', sections: ['chain'], chain })
  }
  return entries
}

/** The kind of page designed for exactly these sections, if any. */
function getPageKind(
  sections: ProjectPageSection[],
): ProjectPageKind | undefined {
  const kinds = Object.keys(PAGE_KINDS) as ProjectPageKind[]
  return kinds.find((kind) => {
    const { sections: needed, alsoShows = [] } = PAGE_KINDS[kind]
    return (
      needed.every((section) => sections.includes(section)) &&
      sections.every(
        (section) => needed.includes(section) || alsoShows.includes(section),
      )
    )
  })
}

function toProjectPage(
  slug: string,
  kind: ProjectPageKind,
  sections: ProjectPageSection[],
): ProjectPage {
  const needed = PAGE_KINDS[kind].sections
  return {
    slug,
    kind,
    sections: [
      ...needed,
      ...sections.filter((section) => !needed.includes(section)),
    ],
  }
}

function unsupported(slug: string, sections: ProjectPageSection[]) {
  return new Error('Unsupported project page sections', {
    cause: { slug, sections },
  })
}

function getSections(
  project: PageProject | undefined,
  { hasChainPage, anyDeployment }: Deployment,
): ProjectPageSection[] {
  const sections: (ProjectPageSection | false | undefined)[] = [
    project?.id === ProjectId.ETHEREUM && 'ethereum',
    !!project?.scalingInfo && 'layer2s',
    // A scaling project's bridge is shown on its scaling page.
    !!project?.interopConfig && !project.scalingInfo && 'interop',
    hasChainPage && 'chain',
    !!project?.zkCatalogInfo && 'zkCatalog',
    !!project?.privacyInfo && 'privacy',
    !!project?.defiInfo &&
      (anyDeployment || hasDefiProjectPage(project)) &&
      'defi',
  ]
  return sections.filter((section) => !!section)
}

/**
 * The page's sections that the site lists somewhere. Ossification keeps DeFi
 * project pages up without the DeFi section.
 */
export function getListedSections(page: ProjectPage): ProjectPageSection[] {
  return page.sections.filter(
    (section) => section !== 'defi' || env.CLIENT_SIDE_DEFI_ENABLED,
  )
}

/**
 * The site sections that list the page's project, for its breadcrumbs: the
 * page's own first.
 */
export function getProjectBreadcrumbs(page: ProjectPage): ProjectSection[] {
  const breadcrumbs = getListedSections(page).flatMap((section) => {
    switch (section) {
      case 'ethereum':
        return []
      // Chain pages show interop flows.
      case 'chain':
        return ['interop' as const]
      default:
        return [section]
    }
  })
  return [...new Set(breadcrumbs)]
}
