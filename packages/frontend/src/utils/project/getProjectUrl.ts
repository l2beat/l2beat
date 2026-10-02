import type {
  InteropConfig,
  Project,
  ProjectDaBridge,
  ProjectDaLayer,
  ProjectDefiInfo,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

export type ProjectWithPageMetadata = Project<
  never,
  | 'daBridge'
  | 'scalingInfo'
  | 'daLayer'
  | 'privacyInfo'
  | 'defiInfo'
  | 'interopConfig'
>

export function getProjectUrl(
  project: {
    slug: string
    daBridge?: ProjectDaBridge | undefined
    daLayer?: ProjectDaLayer | undefined
    privacyInfo?: ProjectPrivacyInfo | undefined
    defiInfo?: ProjectDefiInfo | undefined
    // Required, so a caller that never loads them fails to compile instead of
    // linking an interop protocol to a scaling page that does not exist.
    scalingInfo: ProjectScalingInfo | undefined
    interopConfig: InteropConfig | undefined
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
  if (project.defiInfo) {
    return `/defi/projects/${project.slug}`
  }
  // Scaling projects with a canonical bridge show its interop data on their own page.
  if (project.interopConfig && !project.scalingInfo) {
    return `/interop/protocols/${project.slug}`
  }
  return `/layer2s/projects/${project.slug}`
}
