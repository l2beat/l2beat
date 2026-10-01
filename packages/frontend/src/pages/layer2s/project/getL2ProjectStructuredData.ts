import type { UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import {
  getDatasetStructuredData,
  jsonDownload,
} from '~/ssr/head/structured-data/getDatasetStructuredData'
import type { StructuredDataPage } from '~/ssr/head/structured-data/StructuredData'
import { getL2ProjectApiUrls } from './getL2ProjectApiUrls'

/** Research-only projects publish no JSON, so they get no Dataset. */
export function getL2ProjectStructuredData(
  page: StructuredDataPage,
  project: L2Project & { hasTvsApi: boolean; hasActivityApi: boolean },
) {
  const api = getL2ProjectApiUrls(project)
  const distribution = compact([
    project.hasTvsApi &&
      jsonDownload(`${project.name} Total Value Secured`, api.tvs),
    project.hasActivityApi &&
      jsonDownload(`${project.name} Activity`, api.activity),
  ])
  if (distribution.length === 0) return undefined

  return getDatasetStructuredData(page, { name: project.name, distribution })
}

export function getL2ProjectTvsBreakdownStructuredData(
  page: StructuredDataPage,
  project: L2Project,
) {
  const name = `${project.name} TVS Breakdown`
  return getDatasetStructuredData(page, {
    name,
    distribution: [
      jsonDownload(name, getL2ProjectApiUrls(project).tvsBreakdown),
    ],
  })
}

interface L2Project {
  name: string
  slug: string
  archivedAt: UnixTime | undefined
}
