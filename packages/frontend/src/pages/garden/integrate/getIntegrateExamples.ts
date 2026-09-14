import type {
  ProjectCrops,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ResolvedCrops } from '~/components/garden/crops'
import {
  type CropsAttestationsMeta,
  getAttestationsMeta,
} from '~/server/features/garden/getAttestationsMeta'
import { getGardenProjectPath } from '~/server/features/garden/getGardenProjectPath'
import {
  qualifiesForGarden,
  resolveProjectCrops,
} from '~/server/features/garden/resolveCrops'
import { ps } from '~/server/projects'
import { CROPS_API_URL, type CropsApiEndpointKey } from './content'
import {
  type ElisionKind,
  type ExampleObject,
  type ExampleValue,
  elided,
} from './exampleValue'

export interface IntegrateExample {
  request: string
  /** Abbreviated where it repeats itself. */
  response: ExampleObject
}

export type IntegrateExamples = Record<CropsApiEndpointKey, IntegrateExample>

/** Only the fields the examples need, so tests can supply plain fixtures. */
export interface ExampleProject {
  id: string
  slug: string
  name: string
  crops: ProjectCrops
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
  contracts?:
    | {
        addresses: Record<
          string,
          { address: ChainSpecificAddress; name: string }[]
        >
      }
    | undefined
}

/** API responses link to production whatever host served them. */
const L2BEAT_ORIGIN = 'https://l2beat.com'

const ETHEREUM_CHAIN_ID = 1

/** Keeps the docs rendering when no reviewed project has an Ethereum contract. */
const PLACEHOLDER_CONTRACT = {
  address: ChainSpecificAddress(
    'eth:0x0000000000000000000000000000000000000000',
  ),
  name: 'Contract',
}

/**
 * The three files as crops-api writes them for one reviewed protocol. The
 * shapes are spelled out here rather than imported: crops-api owns the
 * generator, and its OpenAPI document is the contract these mirror.
 */
export async function getIntegrateExamples(): Promise<IntegrateExamples> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['scalingInfo', 'privacyInfo', 'contracts'],
  })
  const meta = getAttestationsMeta()
  return buildIntegrateExamples(
    pickSample(projects, meta),
    meta,
    Math.floor(Date.now() / 1000),
  )
}

export function buildIntegrateExamples(
  sample: ExampleProject,
  meta: CropsAttestationsMeta,
  generatedAt: number,
): IntegrateExamples {
  const stamp = { attestations: meta, generatedAt, commit: '' }
  const project = toApiProject(sample, meta)
  const contract =
    sample.contracts?.addresses.ethereum?.[0] ?? PLACEHOLDER_CONTRACT
  const address = ChainSpecificAddress.address(contract.address).toLowerCase()
  return {
    address: toExample(
      `v1/address/${ETHEREUM_CHAIN_ID}/${address}.json`,
      {
        ...stamp,
        chainId: ETHEREUM_CHAIN_ID,
        address,
        matches: [
          {
            id: project.id,
            slug: project.slug,
            name: project.name,
            href: project.href,
            contractName: contract.name,
            crops: toCropsSummary(project.crops),
            attestation: project.attestation
              ? {
                  uid: project.attestation.uid,
                  revision: project.attestation.revision,
                }
              : null,
          },
        ],
      },
      ['attestations', 'commit'],
    ),
    project: toExample(
      `v1/project/${sample.slug}.json`,
      { ...stamp, ...project },
      ['attestations', 'commit'],
    ),
    crops: toExample('v1/crops.json', { ...stamp, projects: [project] }, [
      'projects',
      'commit',
    ]),
  }
}

interface ApiProject {
  id: string
  slug: string
  name: string
  href: string | null
  crops: ResolvedCrops
  inGarden: boolean
  attestation: {
    uid: string
    revision: number
    reviewedAt: number
    explorerUrl: string
  } | null
}

function toApiProject(
  project: ExampleProject,
  meta: CropsAttestationsMeta,
): ApiProject {
  const path = getGardenProjectPath(project)
  const crops = resolveProjectCrops(project.crops)
  const attested = meta.current?.projectIds.includes(project.id)
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    href: path ? `${L2BEAT_ORIGIN}${path}` : null,
    crops,
    inGarden: qualifiesForGarden(crops),
    attestation:
      meta.current && attested
        ? {
            uid: meta.current.uid,
            revision: meta.current.revision,
            reviewedAt: meta.current.reviewedAt,
            explorerUrl: meta.current.explorerUrl,
          }
        : null,
  }
}

/** Sentiment and status only - the prose lives on the per-project endpoint. */
function toCropsSummary(crops: ResolvedCrops) {
  return Object.fromEntries(
    Object.entries(crops).map(([key, crop]) => [
      key,
      { sentiment: crop.sentiment, status: crop.status },
    ]),
  )
}

/** Prefers a protocol both attested and in the garden that has an Ethereum contract. */
function pickSample(
  projects: ExampleProject[],
  meta: CropsAttestationsMeta,
): ExampleProject {
  const ranked = projects
    .map((source) => ({ source, api: toApiProject(source, meta) }))
    .sort(
      (a, b) =>
        Number(!a.api.attestation) * 2 +
        Number(!a.api.inGarden) -
        (Number(!b.api.attestation) * 2 + Number(!b.api.inGarden)),
    )
  const first = ranked[0]
  if (!first) {
    throw new Error('No reviewed project to build the CROPS examples from')
  }
  return (
    ranked.find(({ source }) => source.contracts?.addresses.ethereum?.[0])
      ?.source ?? first.source
  )
}

function toExample(
  path: string,
  body: object,
  elide: string[],
): IntegrateExample {
  return {
    request: `${CROPS_API_URL}/${path}`,
    response: abbreviateObject(body, new Set(elide)),
  }
}

function abbreviateObject(value: object, elide: Set<string>): ExampleObject {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      abbreviate(item, elide, key),
    ]),
  )
}

/** The keys in `elide` collapsed, and every list of prose cut to its first entry. */
function abbreviate(
  value: unknown,
  elide: Set<string>,
  key?: string,
): ExampleValue {
  if (key !== undefined && elide.has(key)) {
    return elided(elisionKindOf(value))
  }
  if (Array.isArray(value)) {
    const isProse =
      value.length > 1 && value.every((x) => typeof x === 'string')
    return isProse
      ? [abbreviate(value[0], elide), elided('value')]
      : value.map((item) => abbreviate(item, elide))
  }
  if (value !== null && typeof value === 'object') {
    return abbreviateObject(value, elide)
  }
  return value as ExampleValue
}

function elisionKindOf(value: unknown): ElisionKind {
  if (Array.isArray(value)) return 'array'
  if (value !== null && typeof value === 'object') return 'object'
  return 'value'
}
