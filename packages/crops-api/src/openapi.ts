import { toJsonSchemaDefinitions } from '@l2beat/validate'
import {
  CROPS_API_ROUTES,
  CROPS_API_SCHEMAS,
  type CropsApiRoute,
  type CropsAttestationsMeta,
} from './api'

const COMPONENT_SCHEMAS_REF = '#/components/schemas/'

export interface OpenApiOperation {
  summary: string
  description: string
  parameters: {
    name: string
    in: 'path'
    required: true
    description: string
    schema: { type: 'string' | 'integer' }
  }[]
  responses: {
    200: {
      description: string
      content: { 'application/json': { schema: { $ref: string } } }
    }
    404?: { description: string }
  }
}

export function buildOpenApiDocument(ledger: CropsAttestationsMeta) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'L2BEAT CROPS API',
      version: '1.0.0',
      description: describeApi(ledger),
    },
    paths: Object.fromEntries(
      CROPS_API_ROUTES.map((route) => [
        route.path,
        { get: toOperation(route) },
      ]),
    ),
    components: {
      // Every published validator, with `$ref`s already pointing under components.
      schemas: toJsonSchemaDefinitions(CROPS_API_SCHEMAS, {
        refPrefix: COMPONENT_SCHEMAS_REF,
      }),
    },
  }
}

/** Only the network section depends on the ledger, so the testnet caveat cannot outlive the testnet. */
export function describeApi(ledger: CropsAttestationsMeta): string {
  const where = ledger.isTestnet
    ? `currently lives on the ${ledger.network} testnet (chain id ${ledger.chainId}); \`attestations.isTestnet\` in every response says so`
    : `lives on ${ledger.network} (chain id ${ledger.chainId})`
  return `CROPS is L2BEAT's review of a protocol along four crops: censorship resistance, open source, privacy and security. Each crop gets a sentiment (good, warning, bad or neutral) and a status saying how far the review went. A protocol is in the garden when no crop is bad. Separately, the set of reviewed protocols is attested onchain with the Ethereum Attestation Service.

Every response is a static file generated from the L2BEAT repository, so it is served from a CDN with no API key and no rate limit.

## Not found means not reviewed

\`/v1/project/{id}.json\` and \`/v1/address/{chainId}/{address}.json\` answer 404 with an empty body when L2BEAT has not reviewed the project or the address. Treat 404 as "not reviewed", not as an error.

## Address lookups

Address files are keyed by EIP-155 chain id and lowercase address. Lowercase the address before you build the URL. A contract, a proxy implementation behind it, and a permission holder such as a governance multisig all resolve to the protocol. A shared contract lists every protocol that claims it, each once, with the name that protocol gives it.

## Attestations are on ${ledger.network}

The attestation ${where}. It proves the set L2BEAT named, not that the ratings are attested: ratings change as protocols change and are served here without a transaction.

## Verifying the set onchain

1. Read the attestation from the EAS contract with the uid in \`attestations.current\`: \`getAttestation(uid)\`.
2. Check \`revocationTime == 0\`. When the set changes L2BEAT revokes the old attestation and issues the next revision, so a revoked attestation is a stale claim and must not be shown.
3. Check \`attester\` and \`schema\` against \`attestations.attester\` and \`attestations.schemaUid\`, so an attestation someone else made cannot be mistaken for L2BEAT's.
4. Decode \`projectIds\` - these are the protocols L2BEAT has reviewed, as of \`reviewedAt\`, at revision \`revision\`.
5. For the rating per crop, the reasoning and what was not looked at, read \`/v1/project/{id}.json\`.`
}

function toOperation(route: CropsApiRoute): OpenApiOperation {
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
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: { $ref: `${COMPONENT_SCHEMAS_REF}${route.result}` },
          },
        },
      },
      ...(route.notFound && { 404: { description: route.notFound } }),
    },
  }
}
