import type {
  ProjectCrops,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '@l2beat/config'
import { CROP_ATTESTATIONS } from '@l2beat/config'
import { type Validator, v } from '@l2beat/validate'
import {
  CropSentimentSchema,
  CropStatusSchema,
  qualifiesForGarden,
  ResolvedCropEvaluationSchema,
  type ResolvedCrops,
  ResolvedCropsSchema,
  resolveProjectCrops,
} from './crops'

// The CROPS API contract. The validators are the contract: the OpenAPI
// document is built from them, the types are inferred from them, and every
// generated file is parsed with them in tests. Objects are strict so a field
// config adds but the spec does not know fails the test instead of leaking.
// `meta({ description })` reaches the OpenAPI document.

/** API responses link to production whatever host served them. */
export const L2BEAT_ORIGIN = 'https://l2beat.com'

const unixSeconds = () => v.number().meta({ description: 'Unix seconds.' })

export const CropsAttestationsMetaSchema = v.strictObject({
  network: v
    .string()
    .meta({ description: 'EAS network the attestation lives on.' }),
  chainId: v.number(),
  isTestnet: v
    .boolean()
    .meta({ description: 'True while attestations are on a testnet.' }),
  eas: v.string().meta({ description: 'EAS contract address.' }),
  schemaUid: v.string(),
  schema: v.string().meta({ description: 'EAS schema definition string.' }),
  attester: v.string(),
  current: v
    .union([
      v.strictObject({
        uid: v.string(),
        revision: v.number(),
        reviewedAt: unixSeconds(),
        projectIds: v.array(v.string()).meta({ description: 'Sorted.' }),
        txHash: v.string(),
        explorerUrl: v.string(),
      }),
      v.null(),
    ])
    .meta({
      description: 'The live attestation naming the reviewed set, or null.',
    }),
})
export type CropsAttestationsMeta = v.infer<typeof CropsAttestationsMetaSchema>

const CropSummarySchema = v.strictObject({
  sentiment: CropSentimentSchema,
  status: CropStatusSchema,
})

/** Sentiment and status only - the prose lives on the per-project endpoint. */
export const CropsSummarySchema = v.strictObject({
  censorshipResistance: CropSummarySchema,
  openSource: CropSummarySchema,
  privacy: CropSummarySchema,
  security: CropSummarySchema,
})
export type CropsApiSummary = v.infer<typeof CropsSummarySchema>

export const CropsApiAttestationSchema = v.strictObject({
  uid: v.string(),
  revision: v.number(),
  reviewedAt: unixSeconds(),
  explorerUrl: v.string(),
})
export type CropsApiAttestation = v.infer<typeof CropsApiAttestationSchema>

const projectFields = {
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  href: v.union([v.string(), v.null()]).meta({
    description: 'The L2BEAT project page, or null when there is none.',
  }),
  crops: ResolvedCropsSchema,
  inGarden: v.boolean().meta({
    description: 'False while any crop is bad, even though it is reviewed.',
  }),
  attestation: v.union([CropsApiAttestationSchema, v.null()]).meta({
    description:
      'The onchain attestation naming this project, or null when it is not in the attested set. One attestation names the whole set, so it is the same for every attested project.',
  }),
}
export const CropsApiProjectSchema = v.strictObject(projectFields)
export type CropsApiProject = v.infer<typeof CropsApiProjectSchema>

/** What every JSON file carries besides its own data. */
const stampFields = {
  attestations: CropsAttestationsMetaSchema,
  generatedAt: unixSeconds(),
  commit: v.string().meta({
    description: 'The l2beat/l2beat commit the data came from.',
  }),
}
export const CropsApiStampSchema = v.strictObject(stampFields)
export type CropsApiStamp = v.infer<typeof CropsApiStampSchema>

export const CropsResponseSchema = v.strictObject({
  ...stampFields,
  projects: v.array(CropsApiProjectSchema),
})
export type CropsResponse = v.infer<typeof CropsResponseSchema>

export const ProjectResponseSchema = v.strictObject({
  ...stampFields,
  ...projectFields,
})
export type ProjectResponse = v.infer<typeof ProjectResponseSchema>

export const AddressMatchSchema = v.strictObject({
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  href: v.union([v.string(), v.null()]),
  contractName: v.string().meta({
    description: 'The contract or permission the address was matched as.',
  }),
  crops: CropsSummarySchema,
  attestation: v.union([
    v.strictObject({ uid: v.string(), revision: v.number() }),
    v.null(),
  ]),
})
export type AddressMatch = v.infer<typeof AddressMatchSchema>

export const AddressResponseSchema = v.strictObject({
  ...stampFields,
  chainId: v.number(),
  address: v.string().meta({ description: 'Lowercase.' }),
  matches: v.array(AddressMatchSchema).meta({
    description: 'Every reviewed project that claims the address.',
  }),
})
export type AddressResponse = v.infer<typeof AddressResponseSchema>

/** Everything published under OpenAPI components.schemas, by the name a $ref uses. */
export const CROPS_API_SCHEMAS = {
  AttestationsMeta: CropsAttestationsMetaSchema,
  CropEvaluation: ResolvedCropEvaluationSchema,
  Crops: ResolvedCropsSchema,
  CropsSummary: CropsSummarySchema,
  Attestation: CropsApiAttestationSchema,
  Project: CropsApiProjectSchema,
  CropsResponse: CropsResponseSchema,
  ProjectResponse: ProjectResponseSchema,
  AddressMatch: AddressMatchSchema,
  AddressResponse: AddressResponseSchema,
} satisfies Record<string, Validator<unknown>>
export type CropsApiSchemaName = keyof typeof CROPS_API_SCHEMAS

export type CropsApiRouteKey = 'address' | 'project' | 'crops'

export interface CropsApiRoute {
  key: CropsApiRouteKey
  /** OpenAPI template, e.g. `/v1/project/{id}.json`. */
  path: string
  summary: string
  description: string
  params: { name: string; type: 'string' | 'integer'; description: string }[]
  result: CropsApiSchemaName
  /** On lookups, where a missing file means "not reviewed". */
  notFound?: string
}

/** The published routes, in the order the docs present them. */
export const CROPS_API_ROUTES: CropsApiRoute[] = [
  {
    key: 'address',
    path: '/v1/address/{chainId}/{address}.json',
    summary: 'Which protocol is this address?',
    description:
      'The reviewed protocols a contract, proxy implementation or permission holder belongs to, with a rating per crop. A shared contract lists every protocol that claims it, each once, with the name that protocol gives it.',
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
    result: 'AddressResponse',
    notFound: 'The address is not part of any reviewed protocol.',
  },
  {
    key: 'project',
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
    result: 'ProjectResponse',
    notFound: 'L2BEAT has not reviewed this project.',
  },
  {
    key: 'crops',
    path: '/v1/crops.json',
    summary: 'The whole garden',
    description:
      'Every reviewed protocol in one response, with the full crop evaluations and the attestation that names them.',
    params: [],
    result: 'CropsResponse',
  },
]

/** Reads the committed ledger, so no RPC call is needed. */
export function getAttestationsMeta(): CropsAttestationsMeta {
  const ledger = CROP_ATTESTATIONS
  // Anything live under another schema awaits revocation by l2b. Case-insensitive: EAS returns uids in lowercase.
  const current = ledger.live.find(
    (x) => x.schema.toLowerCase() === ledger.schemaUid.toLowerCase(),
  )
  return {
    network: ledger.network,
    chainId: ledger.chainId,
    isTestnet: ledger.isTestnet,
    eas: ledger.eas,
    schemaUid: ledger.schemaUid,
    schema: ledger.schema,
    attester: ledger.attester,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: `${ledger.explorer}/attestation/view/${current.uid}`,
        }
      : null,
  }
}

/** Only the fields the API needs, so tests can supply plain fixtures. */
export interface CropsSourceProject {
  id: string
  slug: string
  name: string
  crops: ProjectCrops
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
}

export function resolveCropsProject(
  project: CropsSourceProject,
  meta: CropsAttestationsMeta,
): CropsApiProject {
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

/**
 * The page a reviewed project has on l2beat.com, or null when it has none.
 * The API links only to pages that exist, so this never falls back to a
 * scaling url the way the frontend's getProjectUrl does.
 */
function getGardenProjectPath(project: CropsSourceProject): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  return null
}

export function toCropsSummary(crops: ResolvedCrops): CropsApiSummary {
  const summarise = (key: keyof ResolvedCrops) => ({
    sentiment: crops[key].sentiment,
    status: crops[key].status,
  })
  return {
    censorshipResistance: summarise('censorshipResistance'),
    openSource: summarise('openSource'),
    privacy: summarise('privacy'),
    security: summarise('security'),
  }
}
