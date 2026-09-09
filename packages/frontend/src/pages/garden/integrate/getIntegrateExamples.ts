import { ProjectId } from '@l2beat/shared-pure'
import {
  BASE_URL,
  getCropsProjects,
} from '~/server/features/garden/getCropsProjects'
import { ps } from '~/server/projects'
import {
  getGardenCropsApiData,
  getGardenCropsProjectApiData,
} from '~/server/routers/PublicApiRouter/getGardenCropsApiData'
import { getGardenLookupApiData } from '~/server/routers/PublicApiRouter/getGardenLookupApiData'
import type { IntegrateEndpoint } from './content'

export interface IntegrateExample {
  /** The full url, ready to copy. */
  request: string
  /** The body the url answers with, abbreviated where it repeats itself. */
  response: string
}

export type IntegrateExamples = Record<IntegrateEndpoint, IntegrateExample>

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * One request and response per endpoint, taken from the API itself rather
 * than typed into the docs, so what the page shows is what a consumer gets.
 * The sample is a protocol that is both attested and in the garden - the
 * case an integrator is building for - and, for the lookup, one of its
 * contracts.
 */
export async function getIntegrateExamples(): Promise<IntegrateExamples> {
  const projects = await getCropsProjects()
  const sample =
    projects.find((x) => x.attested && x.inGarden) ??
    projects.find((x) => x.attested) ??
    projects[0]
  const slug = sample?.slug ?? 'tornado-cash'
  const address = sample ? await getSampleAddress(sample.id) : ZERO_ADDRESS
  const query = `eth:${address}`

  const [lookup, project, crops] = await Promise.all([
    getGardenLookupApiData([query]),
    getGardenCropsProjectApiData(slug),
    getGardenCropsApiData(),
  ])

  return {
    lookup: {
      request: `${BASE_URL}/api/garden/project/lookup?addresses=${query}`,
      response: toExample(lookup, ['attestations']),
    },
    project: {
      request: `${BASE_URL}/api/garden/project/${slug}`,
      response: toExample(project, ['attestations']),
    },
    crops: {
      request: `${BASE_URL}/api/garden/crops`,
      response: toExample(crops, ['projects']),
    },
  }
}

/** The first Ethereum contract of the project, or the zero address. */
async function getSampleAddress(projectId: string): Promise<string> {
  const [project] = await ps.getProjects({
    ids: [ProjectId(projectId)],
    optional: ['contracts'],
  })
  const contract = project?.contracts?.addresses.ethereum?.[0]
  if (!contract) {
    return ZERO_ADDRESS
  }
  // A ChainSpecificAddress is `shortName:0x...`; the query wants the 0x part.
  return contract.address.slice(contract.address.indexOf(':') + 1)
}

// Sentinels that no real value can equal, swapped for elisions once the
// document is a string. Leading spaces keep them clear of any id or url.
const ELIDED_OBJECT = ' elided object'
const ELIDED_ARRAY = ' elided array'
const AND_MORE = ' and more'

/**
 * The response as JSON, with the keys in `elide` collapsed to `{ … }` or
 * `[ … ]` and every list of prose cut to its first entry. Enough to show the
 * shape; the whole thing is one request away.
 */
function toExample(value: unknown, elide: string[]): string {
  const json = JSON.stringify(
    value,
    (key, item: unknown) => {
      if (elide.includes(key)) {
        return Array.isArray(item) ? ELIDED_ARRAY : ELIDED_OBJECT
      }
      if (
        Array.isArray(item) &&
        item.length > 1 &&
        item.every((x) => typeof x === 'string')
      ) {
        return [item[0], AND_MORE]
      }
      return item
    },
    2,
  )
  return json
    .replaceAll(JSON.stringify(ELIDED_OBJECT), '{ … }')
    .replaceAll(JSON.stringify(ELIDED_ARRAY), '[ … ]')
    .replaceAll(JSON.stringify(AND_MORE), '…')
}
