import {
  type CropsApiFile,
  type CropsApiInputProject,
  type CropsApiRouteKey,
  type CropsAttestationsMeta,
  generateCropsApiFiles,
  getAttestationsMeta,
  resolveCropsProject,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { CROPS_API_URL } from './content'

/** A JSON value, possibly with parts cut short - see `Elision`. */
export type ExampleValue =
  | null
  | boolean
  | number
  | string
  | ExampleValue[]
  | ExampleObject

export type ExampleObject = { [key: string]: ExampleValue }

export type ElisionKind = 'value' | 'object' | 'array'

/**
 * Where an example leaves something out, kept as data so the page can render
 * `…`, `{ … }` or `[ … ]` without parsing, and tests can assert on the rest.
 * The key is one no response has, since every response schema is strict.
 */
export type Elision = { '…': ElisionKind }

export function elided(kind: ElisionKind): Elision {
  return { '…': kind }
}

export function getElision(value: ExampleValue): ElisionKind | undefined {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }
  const kind = value['…']
  return typeof kind === 'string' ? (kind as ElisionKind) : undefined
}

export interface IntegrateExample {
  request: string
  /** Abbreviated where it repeats itself. */
  response: ExampleObject
}

export type IntegrateExamples = Record<CropsApiRouteKey, IntegrateExample>

const ETHEREUM_CHAIN_ID = 1

/** Keeps the docs rendering when no reviewed project has an Ethereum contract. */
const PLACEHOLDER_CONTRACT = {
  address: ChainSpecificAddress(
    'eth:0x0000000000000000000000000000000000000000',
  ),
  name: 'Contract',
}

/**
 * The real generator run on one reviewed protocol, so the examples are the
 * files the API serves and cannot drift from them.
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
  sample: CropsApiInputProject,
  meta: CropsAttestationsMeta,
  generatedAt: number,
): IntegrateExamples {
  const files = generateCropsApiFiles({
    projects: [sample],
    chains: { ethereum: ETHEREUM_CHAIN_ID },
    ledger: meta,
    commit: '',
    generatedAt,
  })
  const file = <K extends CropsApiRouteKey>(route: K, path?: string) => {
    const found = files.find(
      (x) => x.route === route && (path === undefined || x.path === path),
    )
    if (!found) {
      throw new Error(`The generator wrote no ${route} file for ${sample.id}`)
    }
    return found
  }
  return {
    address: toExample(file('address'), ['attestations', 'commit']),
    project: toExample(file('project', `v1/project/${sample.slug}.json`), [
      'attestations',
      'commit',
    ]),
    crops: toExample(file('crops'), ['projects', 'commit']),
  }
}

/** Prefers a protocol both attested and in the garden that has an Ethereum contract. */
function pickSample(
  projects: CropsApiInputProject[],
  meta: CropsAttestationsMeta,
): CropsApiInputProject {
  const ranked = projects
    .map((source) => ({ source, api: resolveCropsProject(source, meta) }))
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
  for (const { source } of ranked) {
    const contract = source.contracts?.addresses.ethereum?.[0]
    if (contract) {
      return withOneContract(source, contract)
    }
  }
  return withOneContract(first.source, PLACEHOLDER_CONTRACT)
}

/** One address file is enough for the docs, and the generator needs a chain id for every other chain. */
function withOneContract(
  project: CropsApiInputProject,
  contract: { address: ChainSpecificAddress; name: string },
): CropsApiInputProject {
  return {
    ...project,
    contracts: { addresses: { ethereum: [contract] } },
    permissions: undefined,
  }
}

function toExample(file: CropsApiFile, elide: string[]): IntegrateExample {
  return {
    request: `${CROPS_API_URL}/${file.path}`,
    response: abbreviateObject(file.body, new Set(elide)),
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
