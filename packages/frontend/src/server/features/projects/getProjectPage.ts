import { INTEROP_CHAINS, type InteropChain, type Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import type { ProjectSection } from '~/components/projects/projectSections'
import { env } from '~/env'
import { ps } from '~/server/projects'
import {
  getChainProjects,
  selectChainProjects,
} from '../chains/getChainProjects'
import { isListedDefiProject } from '../defi/isListedDefiProject'
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

/**
 * Every page a project can have: the combination of sections it is designed
 * for, with the section the page is built on first. A project in any other
 * combination has no page until someone designs it, which means adding it
 * here and to `PROJECT_PAGES`.
 */
export const PROJECT_PAGE_KINDS = {
  ethereum: ['ethereum'],
  layer2s: ['layer2s'],
  layer2sPrivacy: ['layer2s', 'privacy'],
  interop: ['interop'],
  interopChain: ['interop', 'chain'],
  chain: ['chain'],
  zkCatalog: ['zkCatalog'],
  privacy: ['privacy'],
  privacyZkCatalog: ['privacy', 'zkCatalog'],
  defi: ['defi'],
} as const satisfies Record<
  string,
  readonly [ProjectPageSection, ...ProjectPageSection[]]
>

export type ProjectPageKind = keyof typeof PROJECT_PAGE_KINDS

export interface ProjectPage {
  slug: string
  kind: ProjectPageKind
  /** The sections of the kind: the one the page is built on first. */
  sections: readonly ProjectPageSection[]
  /** The sections whose lists show the project: for search and the sitemap. */
  listed: ProjectPageSection[]
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

/** What decides which pages exist, apart from the projects themselves. */
export interface Deployment {
  /** The chains whose flows are shown. */
  chains: readonly InteropChain[]
  hasDefiPage(project: PageProject): boolean
}

function thisDeployment(): Deployment {
  return { chains: getActiveInteropChains(), hasDefiPage: hasDefiProjectPage }
}

/**
 * Every chain and every flag on: for what must cover any deployment, like the
 * tests and `pnpm og-images`, which run before one exists.
 */
export const EVERY_DEPLOYMENT: Deployment = {
  chains: INTEROP_CHAINS,
  hasDefiPage: () => true,
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
  const hasChainPage = chainProjects.some((chain) => chain.slug === slug)
  const sections = getSections(project, hasChainPage, thisDeployment())
  if (sections.length === 0) return undefined
  const kind = findKind(sections)
  // Loud, so that the page gets designed.
  if (!kind) throw unsupportedError(slug, sections)
  return toProjectPage(slug, kind, project)
}

/** A page with what it is about: a project, or a chain no section lists. */
export type ProjectPageEntry<P> = ProjectPage &
  (
    | { kind: 'chain'; chain: InteropChain; project?: undefined }
    | {
        kind: Exclude<ProjectPageKind, 'chain'>
        project: P
        /** The chain whose flows the page shows, if it has the chain section. */
        chain?: InteropChain
      }
  )

/**
 * Every project page in a deployment, this one by default. Takes all
 * projects, not a selection: which chains get a page of their own depends on
 * which are scaling projects.
 *
 * A project in sections no page is designed for is left out, so that the
 * lists every page reads stay up; its own page throws, and
 * `findUnsupportedProjectPages` names it for the tests.
 */
export function selectProjectPages<P extends PageProject>(
  projects: P[],
  deployment: Deployment = thisDeployment(),
): ProjectPageEntry<P>[] {
  return resolveProjectPages(projects, deployment).pages
}

/** The projects in sections no page is designed for, with those sections. */
export function findUnsupportedProjectPages(
  projects: PageProject[],
  deployment: Deployment,
): Map<string, ProjectPageSection[]> {
  return resolveProjectPages(projects, deployment).unsupported
}

function resolveProjectPages<P extends PageProject>(
  projects: P[],
  deployment: Deployment,
) {
  const l2ProjectIds = new Set(
    projects.filter((p) => p.scalingInfo).map((p) => p.id),
  )
  const chains = new Map(
    selectChainProjects(deployment.chains, l2ProjectIds).map(
      ({ slug, ...chain }): [string, InteropChain] => [slug, chain],
    ),
  )

  const pages: ProjectPageEntry<P>[] = []
  const unsupported = new Map<string, ProjectPageSection[]>()
  for (const project of projects) {
    const chain = chains.get(project.slug)
    const sections = getSections(project, chain !== undefined, deployment)
    // Nothing but the chain's flows: the chain's own page, added below.
    if (sections.length === 0 || isChainOnly(sections)) continue
    chains.delete(project.slug)
    const kind = findKind(sections)
    if (!kind || kind === 'chain') {
      unsupported.set(project.slug, sections)
      continue
    }
    pages.push({
      ...toProjectPage(project.slug, kind, project),
      kind,
      project,
      chain,
    })
  }
  for (const [slug, chain] of chains) {
    pages.push({
      ...toProjectPage(slug, 'chain', undefined),
      kind: 'chain',
      chain,
    })
  }
  return { pages, unsupported }
}

function isChainOnly(sections: ProjectPageSection[]) {
  return sections.length === 1 && sections[0] === 'chain'
}

/** The kind of page designed for exactly these sections, if any. */
function findKind(sections: ProjectPageSection[]): ProjectPageKind | undefined {
  const kinds = Object.keys(PROJECT_PAGE_KINDS) as ProjectPageKind[]
  return kinds.find((kind) => {
    const designed: readonly ProjectPageSection[] = PROJECT_PAGE_KINDS[kind]
    return (
      designed.length === sections.length &&
      designed.every((section) => sections.includes(section))
    )
  })
}

function toProjectPage(
  slug: string,
  kind: ProjectPageKind,
  project: PageProject | undefined,
): ProjectPage {
  const sections: readonly ProjectPageSection[] = PROJECT_PAGE_KINDS[kind]
  return {
    slug,
    kind,
    sections,
    // DeFi lists only the categories that have a page of their own.
    listed: sections.filter(
      (section) =>
        section !== 'defi' ||
        (env.CLIENT_SIDE_DEFI_ENABLED &&
          isListedDefiProject(project?.defiInfo)),
    ),
  }
}

function unsupportedError(slug: string, sections: ProjectPageSection[]) {
  return new Error('Unsupported project page sections', {
    cause: { slug, sections },
  })
}

function getSections(
  project: PageProject | undefined,
  hasChainPage: boolean,
  deployment: Deployment,
): ProjectPageSection[] {
  const sections: (ProjectPageSection | false)[] = [
    project?.id === ProjectId.ETHEREUM && 'ethereum',
    !!project?.scalingInfo && 'layer2s',
    // A scaling project's bridge is shown on its scaling page.
    !!project?.interopConfig && !project?.scalingInfo && 'interop',
    hasChainPage && 'chain',
    !!project?.zkCatalogInfo && 'zkCatalog',
    !!project?.privacyInfo && 'privacy',
    !!project?.defiInfo && deployment.hasDefiPage(project) && 'defi',
  ]
  return sections.filter((section) => !!section)
}

/**
 * The site sections that list the page's project, for its breadcrumbs: the
 * page's own first.
 */
export function getProjectBreadcrumbs(page: ProjectPage): ProjectSection[] {
  const breadcrumbs = page.sections.flatMap((section) => {
    switch (section) {
      case 'ethereum':
        return []
      // Chain pages show interop flows.
      case 'chain':
        return ['interop' as const]
      // Ossification keeps DeFi project pages up without the DeFi section.
      case 'defi':
        return env.CLIENT_SIDE_DEFI_ENABLED ? [section] : []
      default:
        return [section]
    }
  })
  return [...new Set(breadcrumbs)]
}
