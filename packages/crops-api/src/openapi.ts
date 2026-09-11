import { toJsonSchema, type Validator, v } from '@l2beat/validate'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  AddressesResponseSchema,
  AddressResponseSchema,
  type CropsAttestationsMeta,
  CropsResponseSchema,
  NAMED_SCHEMAS,
  ProjectResponseSchema,
} from './schemas'

const COMPONENT_SCHEMAS_REF = '#/components/schemas/'

export const SERVERS = [
  { url: 'https://crops.l2beat.com', description: 'Production' },
  { url: 'https://crops-staging.l2beat.com', description: 'Staging' },
]

export interface PublishedRoute {
  /** OpenAPI template, e.g. `/v1/project/{id}.json`. */
  path: string
  summary: string
  description: string
  params: { name: string; type: 'string' | 'integer'; description: string }[]
  result: Validator<unknown>
  /** Set on lookups, where a missing file means "not reviewed". */
  notFound?: string
}

export const PUBLISHED_ROUTES: PublishedRoute[] = [
  {
    path: '/v1/crops.json',
    summary: 'The whole garden',
    description:
      'Every reviewed protocol in one response, with the full crop evaluations and the attestation that names them.',
    params: [],
    result: CropsResponseSchema,
  },
  {
    path: '/v1/project/{id}.json',
    summary: 'Everything about one protocol',
    description:
      'The crop evaluations of one protocol, with the reasoning behind each rating.',
    params: [
      {
        name: 'id',
        type: 'string',
        description: 'The project id or its slug.',
      },
    ],
    result: ProjectResponseSchema,
    notFound: 'L2BEAT has not reviewed this project.',
  },
  {
    path: '/v1/address/{chainId}/{address}.json',
    summary: 'Which protocol is this address?',
    description:
      'The reviewed protocols a contract, proxy implementation or permission holder belongs to, with a rating per crop.',
    params: [
      {
        name: 'chainId',
        type: 'integer',
        description: 'EIP-155 chain id, e.g. 1 for Ethereum.',
      },
      {
        name: 'address',
        type: 'string',
        description: 'Lowercase 0x-prefixed address.',
      },
    ],
    result: AddressResponseSchema,
    notFound: 'The address is not part of any reviewed protocol.',
  },
  {
    path: '/v1/addresses.json',
    summary: 'Every reviewed address',
    description:
      'The whole address index in one file, so a client can download it once and answer lookups offline.',
    params: [],
    result: AddressesResponseSchema,
  },
]

/** The route a generated file path (without the leading slash) is served by. */
export function findPublishedRoute(
  filePath: string,
): PublishedRoute | undefined {
  return PUBLISHED_ROUTES.find((route) =>
    toPathRegex(route.path).test(`/${filePath}`),
  )
}

function toPathRegex(template: string): RegExp {
  const escaped = template.replace(/[.]/g, '\\.').replace(/\{[^}]+\}/g, '[^/]+')
  return new RegExp(`^${escaped}$`)
}

/** The prose lives in openapi.md; only the network section depends on the ledger. */
const OPENAPI_PROSE = readFileSync(resolve(__dirname, '../openapi.md'), 'utf8')

export function buildOpenApiDescription(ledger: CropsAttestationsMeta) {
  return OPENAPI_PROSE.replace(
    '{{ATTESTATION_NETWORK_SECTION}}',
    attestationNetworkSection(ledger),
  ).trim()
}

/** Derived from the same ledger as every data file, so the caveat cannot outlive the testnet. */
function attestationNetworkSection(ledger: CropsAttestationsMeta): string {
  const where = ledger.isTestnet
    ? `currently lives on the ${ledger.network} testnet (chain id ${ledger.chainId}); \`attestations.isTestnet\` in every response says so`
    : `lives on ${ledger.network} (chain id ${ledger.chainId})`
  return `## Attestations are on ${ledger.network}

The attestation ${where}. It proves the set L2BEAT named, not that the ratings are attested: ratings change as protocols change and are served here without a transaction.`
}

export function buildOpenApiDocument(ledger: CropsAttestationsMeta) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'L2BEAT CROPS API',
      version: '1.0.0',
      description: buildOpenApiDescription(ledger),
    },
    servers: SERVERS,
    paths: Object.fromEntries(
      PUBLISHED_ROUTES.map((route) => [
        route.path,
        { get: toOperation(route) },
      ]),
    ),
    components: { schemas: toComponentSchemas() },
  }
}

function toOperation(route: PublishedRoute) {
  const responses: Record<string, unknown> = {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            $ref: `${COMPONENT_SCHEMAS_REF}${route.result.description}`,
          },
        },
      },
    },
  }
  if (route.notFound) {
    responses[404] = { description: route.notFound }
  }
  return {
    summary: route.summary,
    description: route.description,
    parameters: route.params.map((param) => ({
      name: param.name,
      in: 'path',
      required: true,
      description: param.description,
      schema: { type: param.type },
    })),
    responses,
  }
}

/** Every named validator, with `$ref`s already pointing under components. */
function toComponentSchemas(): Record<string, unknown> {
  const { definitions } = toJsonSchema(v.unknown(), NAMED_SCHEMAS, {
    refPrefix: COMPONENT_SCHEMAS_REF,
  }) as { definitions: Record<string, unknown> }
  return definitions
}
