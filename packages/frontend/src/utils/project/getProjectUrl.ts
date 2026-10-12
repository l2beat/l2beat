import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

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
  'slug' | PageMetadataField
>

export function getProjectUrl(
  project: ProjectPageMetadata,
  daLayers: { id: ProjectId; slug: string }[],
): string {
  if (project.daBridge) {
    const layer = daLayers.find((x) => x.id === project.daBridge?.daLayer)
    return `/data-availability/projects/${layer?.slug}/${project.slug}`
  }
  if (project.daLayer) {
    return `/data-availability/projects/${project.slug}/no-bridge`
  }
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.defiInfo) {
    return `/defi/projects/${project.slug}`
  }
  // Scaling projects with a canonical bridge show its interop data on their own page.
  if (project.interopConfig && !project.scalingInfo) {
    return `/interop/protocols/${project.slug}`
  }
  return `/layer2s/projects/${project.slug}`
}
