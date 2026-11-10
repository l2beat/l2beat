import type { Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'

/**
 * The fields that decide which kind of page a project has. Queries spread this
 * list, so a new page kind reaches every caller of `getProjectUrl` at once.
 */
export const PROJECT_PAGE_METADATA_FIELDS = [
  'daBridge',
  'scalingInfo',
  'daLayer',
  'privacyInfo',
  'defiInfo',
  'interopConfig',
] as const

type PageMetadataField = (typeof PROJECT_PAGE_METADATA_FIELDS)[number]

export type ProjectWithPageMetadata = Project<never, PageMetadataField>

export type ProjectPageMetadata = Pick<
  ProjectWithPageMetadata,
  'id' | 'slug' | PageMetadataField
>

export function getProjectUrl(
  project: ProjectPageMetadata,
): string | undefined {
  if (project.id === ProjectId.ETHEREUM) {
    return ETHEREUM_PROJECT_PATH
  }
  // Other DA layers and bridges have no pages of their own.
  if (project.daBridge || project.daLayer) {
    return undefined
  }
  return getProjectPath(project.slug)
}

/**
 * For redirects to project pages. A day, not forever: browsers keep a 301
 * without it indefinitely, which is what made `?migration=1` necessary.
 */
export const PROJECT_REDIRECT_CACHE_CONTROL = 'public, max-age=86400'

/** Every project's page, whichever sections it is in. */
export function getProjectPath(slug: string): `/projects/${string}` {
  return `/projects/${slug}`
}

/** The social preview image of a project's page, made by `pnpm og-images`. */
export function getProjectOgImagePath(slug: string) {
  return `/meta-images/projects/${slug}/opengraph-image.png`
}
