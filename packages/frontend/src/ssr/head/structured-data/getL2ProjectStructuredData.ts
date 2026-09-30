import compact from 'lodash/compact'
import { getProjectMetadataDescription } from '../getProjectMetadataDescription'
import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

/**
 * A Dataset rather than a plain WebPage because the page's metrics are
 * published as machine-readable JSON, which `distribution` points at.
 */
export function getL2ProjectStructuredData(project: L2Project) {
  const url = toProductionUrl(`/layer2s/projects/${project.slug}`)
  return withSchemaOrgContext({
    '@type': 'Dataset',
    '@id': url,
    url,
    name: project.name,
    description: getProjectMetadataDescription(project),
    isAccessibleForFree: true,
    creator: L2BEAT_ORGANIZATION,
    distribution: compact([
      project.hasTvsApi &&
        jsonApi(`${project.name} Total Value Secured`, 'tvs', project.slug),
      project.hasActivityApi &&
        jsonApi(`${project.name} Activity`, 'activity', project.slug),
    ]),
  })
}

interface L2Project {
  name: string
  slug: string
  display: { description: string }
  hasTvsApi: boolean
  hasActivityApi: boolean
}

function jsonApi(name: string, metric: 'tvs' | 'activity', slug: string) {
  return {
    '@type': 'DataDownload',
    name,
    encodingFormat: 'application/json',
    contentUrl: toProductionUrl(`/api/scaling/${metric}/${slug}`),
  }
}
