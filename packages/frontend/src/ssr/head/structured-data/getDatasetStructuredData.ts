import { L2BEAT_ORGANIZATION } from './getOrganizationStructuredData'
import type { StructuredDataPage } from './StructuredData'

/**
 * A Dataset rather than a plain WebPage because the page's metrics are
 * published as machine-readable JSON, which `distribution` points at.
 */
export function getDatasetStructuredData(
  page: StructuredDataPage,
  dataset: { name: string; distribution: DataDownload[] },
) {
  return {
    '@type': 'Dataset',
    '@id': page.url,
    url: page.url,
    name: dataset.name,
    description: page.description,
    isAccessibleForFree: true,
    creator: L2BEAT_ORGANIZATION,
    distribution: dataset.distribution,
  }
}

type DataDownload = ReturnType<typeof jsonDownload>

export function jsonDownload(name: string, contentUrl: string) {
  return {
    '@type': 'DataDownload' as const,
    name,
    encodingFormat: 'application/json',
    contentUrl,
  }
}
