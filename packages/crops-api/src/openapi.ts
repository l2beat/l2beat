import { CROPS } from '@l2beat/config'
import { toJsonSchema, type Validator, v } from '@l2beat/validate'
import {
  AddressesResponseSchema,
  AddressResponseSchema,
  CropsResponseSchema,
  NAMED_SCHEMAS,
  ProjectResponseSchema,
} from './schemas'

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

const ATTESTATION_NETWORK =
  CROPS.eas.ATTESTATION_NETWORKS[CROPS.eas.ATTESTATION_NETWORK]

/** Derived from the network constant so the caveat cannot outlive the testnet. */
const ATTESTATION_NETWORK_SECTION = ATTESTATION_NETWORK.isTestnet
  ? `## Attestations are on ${ATTESTATION_NETWORK.name}

The attestation currently lives on the ${ATTESTATION_NETWORK.name} testnet (chain id ${ATTESTATION_NETWORK.chainId}); \`attestations.isTestnet\` in every response says so. It proves the set L2BEAT named, not that the ratings are attested: ratings change as protocols change and are served here without a transaction.`
  : `## Attestations are on ${ATTESTATION_NETWORK.name}

The attestation lives on ${ATTESTATION_NETWORK.name} (chain id ${ATTESTATION_NETWORK.chainId}). It proves the set L2BEAT named, not that the ratings are attested: ratings change as protocols change and are served here without a transaction.`

export const OPENAPI_DESCRIPTION = `
CROPS is L2BEAT's review of a protocol along four crops: censorship resistance, open source, privacy and security. Each crop gets a sentiment (good, warning, bad or neutral) and a status saying how far the review went. A protocol is in the garden when no crop is bad. Separately, the set of reviewed protocols is attested onchain with the Ethereum Attestation Service.

Every response is a static file generated from the L2BEAT repository, so it is served from a CDN with no API key and no rate limit.

## Not found means not reviewed

\`/v1/project/{id}.json\` and \`/v1/address/{chainId}/{address}.json\` answer 404 with an empty body when L2BEAT has not reviewed the project or the address. Treat 404 as "not reviewed", not as an error.

## Address lookups

Address files are keyed by EIP-155 chain id and lowercase address, both in the path and in the \`addresses\` map of \`/v1/addresses.json\` (as \`chainId:address\`). Lowercase the address before you build the URL. A contract, a proxy implementation behind it, and a permission holder such as a governance multisig all resolve to the protocol. A shared contract lists every protocol that claims it, each once, with the name that protocol gives it.

${ATTESTATION_NETWORK_SECTION}

## Verifying the set onchain

1. Read the attestation from the EAS contract with the uid in \`attestations.current\`: \`getAttestation(uid)\`.
2. Check \`revocationTime == 0\`. When the set changes L2BEAT revokes the old attestation and issues the next revision, so a revoked attestation is a stale claim and must not be shown.
3. Check \`attester\` and \`schema\` against \`attestations.attester\` and \`attestations.schemaUid\`, so an attestation someone else made cannot be mistaken for L2BEAT's.
4. Decode \`projectIds\` - these are the protocols L2BEAT has reviewed, as of \`reviewedAt\`, at revision \`revision\`.
5. For the rating per crop, the reasoning and what was not looked at, read \`/v1/project/{id}.json\`.
`.trim()

export function buildOpenApiDocument() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'L2BEAT CROPS API',
      version: '1.0.0',
      description: OPENAPI_DESCRIPTION,
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
          schema: { $ref: `#/components/schemas/${route.result.description}` },
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

/**
 * `toJsonSchema` emits every named validator under `definitions` and refers
 * to them as `#/definitions/X`; OpenAPI wants them under components.
 */
function toComponentSchemas(): Record<string, unknown> {
  const { definitions } = toJsonSchema(v.unknown(), NAMED_SCHEMAS) as {
    definitions: Record<string, unknown>
  }
  return JSON.parse(
    JSON.stringify(definitions).replaceAll(
      '#/definitions/',
      '#/components/schemas/',
    ),
  )
}
