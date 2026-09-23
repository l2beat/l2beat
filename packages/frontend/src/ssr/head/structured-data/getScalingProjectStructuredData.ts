import { UnixTime } from '@l2beat/shared-pure'
import { getProjectMetadataDescription } from '../getProjectMetadataDescription'
import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

interface ScalingProject {
  name: string
  slug: string
  display: { description: string }
  discoveryInfo?: { baseTimestamp: number | undefined }
  // Only their presence matters: each one means a public API serves it.
  tvsConfig?: unknown
  activityConfig?: unknown
}

/**
 * A Dataset rather than a plain WebPage because the page's metrics are
 * published as machine-readable JSON, which `distribution` points at.
 */
export function getScalingProjectStructuredData(project: ScalingProject) {
  const url = toProductionUrl(`/layer2s/projects/${project.slug}`)
  const researchedAt = project.discoveryInfo?.baseTimestamp
  return withSchemaOrgContext({
    '@type': 'Dataset',
    '@id': url,
    url,
    name: project.name,
    description: getProjectMetadataDescription(project),
    // The on-chain state the research reflects; the live metrics refresh
    // continuously, so they have no single modification date.
    ...(researchedAt !== undefined && {
      dateModified: UnixTime.toDate(UnixTime(researchedAt)).toISOString(),
    }),
    isAccessibleForFree: true,
    creator: L2BEAT_ORGANIZATION,
    distribution: [
      ...(project.tvsConfig
        ? [jsonApi(`${project.name} Total Value Secured`, 'tvs', project.slug)]
        : []),
      ...(project.activityConfig
        ? [jsonApi(`${project.name} Activity`, 'activity', project.slug)]
        : []),
    ],
  })
}

function jsonApi(name: string, metric: 'tvs' | 'activity', slug: string) {
  return {
    '@type': 'DataDownload',
    name,
    encodingFormat: 'application/json',
    contentUrl: toProductionUrl(`/api/scaling/${metric}/${slug}`),
  }
}
