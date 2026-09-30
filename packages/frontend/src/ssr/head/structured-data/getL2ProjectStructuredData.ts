import compact from 'lodash/compact'
import { getProjectMetadataDescription } from '../getProjectMetadataDescription'
import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import { toProductionUrl, withSchemaOrgContext } from './StructuredData'

/**
 * A Dataset rather than a plain WebPage because the page's metrics are
 * published as machine-readable JSON, which `distribution` points at.
 * Research-only projects publish no such JSON, so they get no Dataset.
 */
export function getL2ProjectStructuredData(project: L2Project) {
  const distribution = compact([
    project.hasTvsApi &&
      jsonApi(
        `${project.name} Total Value Secured`,
        `/api/scaling/tvs/${project.slug}`,
      ),
    project.hasActivityApi &&
      jsonApi(
        `${project.name} Activity`,
        `/api/scaling/activity/${project.slug}`,
      ),
  ])
  if (distribution.length === 0) return undefined

  return getDataset({
    pagePath: `/layer2s/projects/${project.slug}`,
    name: project.name,
    description: getProjectMetadataDescription(project),
    distribution,
  })
}

export function getL2ProjectTvsBreakdownStructuredData(
  project: { name: string; slug: string },
  description: string,
) {
  const name = `${project.name} TVS Breakdown`
  return getDataset({
    pagePath: `/layer2s/projects/${project.slug}/tvs-breakdown`,
    name,
    description,
    distribution: [jsonApi(name, `/api/scaling/tvs/${project.slug}/breakdown`)],
  })
}

interface L2Project {
  name: string
  slug: string
  display: { description: string }
  hasTvsApi: boolean
  hasActivityApi: boolean
}

interface Dataset {
  pagePath: string
  name: string
  description: string
  distribution: DataDownload[]
}

type DataDownload = ReturnType<typeof jsonApi>

function getDataset(dataset: Dataset) {
  const url = toProductionUrl(dataset.pagePath)
  return withSchemaOrgContext({
    '@type': 'Dataset',
    '@id': url,
    url,
    name: dataset.name,
    description: dataset.description,
    isAccessibleForFree: true,
    creator: L2BEAT_ORGANIZATION,
    distribution: dataset.distribution,
  })
}

function jsonApi(name: string, apiPath: string) {
  return {
    '@type': 'DataDownload' as const,
    name,
    encodingFormat: 'application/json',
    contentUrl: toProductionUrl(apiPath),
  }
}
