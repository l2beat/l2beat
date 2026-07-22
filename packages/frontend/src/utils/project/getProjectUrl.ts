import type {
  Project,
  ProjectDaBridge,
  ProjectDaLayer,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

export type ProjectWithPageMetadata = Project<
  never,
  'daBridge' | 'scalingInfo' | 'daLayer' | 'privacyInfo'
>

export function getProjectUrl(
  project: {
    slug: string
    daBridge?: ProjectDaBridge | undefined
    daLayer?: ProjectDaLayer | undefined
    privacyInfo?: ProjectPrivacyInfo | undefined
  },
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
  return `/layer2s/projects/${project.slug}`
}
