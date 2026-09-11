import type {
  CropSentiment,
  ProjectCropStatus,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config'
import type { Equal, Expect } from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'

// The validators are the API contract: the OpenAPI document is built from
// them, the TS types below are inferred from them, and every generated file
// is parsed with them in tests. Objects are strict so a field config adds
// but the spec does not know fails the test instead of leaking.

export type CropsAttestationsMeta = v.infer<typeof AttestationsMetaSchema>
export type CropsApiAttestation = v.infer<typeof AttestationSchema>
export type CropsApiProject = v.infer<typeof ProjectSchema>
/** Sentiment and status only - the prose lives on the per-project endpoint. */
export type CropsApiSummary = v.infer<typeof CropsSummarySchema>
export type AddressMatch = v.infer<typeof AddressMatchSchema>

const AttestationsMetaSchema = v
  .strictObject({
    network: v.string().describe('EAS network the attestation lives on.'),
    chainId: v.number(),
    isTestnet: v
      .boolean()
      .describe('True while attestations are on a testnet such as Sepolia.'),
    eas: v.string().describe('EAS contract address.'),
    schemaUid: v.string(),
    schema: v.string().describe('EAS schema definition string.'),
    attester: v
      .union([v.string(), v.null()])
      .describe('Null until the first attestation is published.'),
    current: v
      .union([
        v.strictObject({
          uid: v.string(),
          revision: v.number(),
          reviewedAt: v.number().describe('Unix seconds.'),
          projectIds: v.array(v.string()).describe('Sorted.'),
          txHash: v.string(),
          explorerUrl: v.string(),
        }),
        v.null(),
      ])
      .describe('The live attestation naming the reviewed set, or null.'),
  })
  .describe('AttestationsMeta')

const CropSentimentSchema = v.enum(['good', 'warning', 'bad', 'neutral'])
const CropStatusSchema = v.enum([
  'reviewed',
  'partiallyReviewed',
  'notReviewed',
  'fullyTransparent',
])
// So an enum cannot silently gain or lose a value config has.
type _SentimentMatchesConfig = Expect<
  Equal<v.infer<typeof CropSentimentSchema>, CropSentiment>
>
type _StatusMatchesConfig = Expect<
  Equal<v.infer<typeof CropStatusSchema>, ProjectCropStatus>
>

// Annotated with the config types so a crop key or field the schema misses
// fails to compile.
const CropEvaluationSchema: Validator<ResolvedCropEvaluation> = v
  .strictObject({
    sentiment: CropSentimentSchema,
    status: CropStatusSchema,
    license: v
      .strictObject({
        spdxId: v.string(),
        name: v.string(),
        url: v.string(),
        categories: v.array(v.string()),
      })
      .optional()
      .describe('Only on the open source crop, once the license is confirmed.'),
    points: v.array(v.string()),
    missing: v.array(v.string()),
    additionalConsiderations: v.array(v.string()),
    notReviewed: v.array(v.string()),
  })
  .describe('CropEvaluation')

const CropsSchema: Validator<ResolvedCrops> = v
  .strictObject({
    censorshipResistance: CropEvaluationSchema,
    openSource: CropEvaluationSchema,
    privacy: CropEvaluationSchema,
    security: CropEvaluationSchema,
  })
  .describe('Crops')

const CropSummarySchema = v.strictObject({
  sentiment: CropSentimentSchema,
  status: CropStatusSchema,
})

const CropsSummarySchema = v
  .strictObject({
    censorshipResistance: CropSummarySchema,
    openSource: CropSummarySchema,
    privacy: CropSummarySchema,
    security: CropSummarySchema,
  })
  .describe('CropsSummary')

const AttestationSchema = v
  .strictObject({
    uid: v.string(),
    revision: v.number(),
    reviewedAt: v.number().describe('Unix seconds.'),
    explorerUrl: v.string(),
  })
  .describe('Attestation')

const projectFields = {
  id: v.string(),
  slug: v.string(),
  name: v.string(),
  href: v
    .union([v.string(), v.null()])
    .describe('The L2BEAT project page, or null when there is none.'),
  crops: CropsSchema,
  inGarden: v
    .boolean()
    .describe('False while any crop is bad, even though it is reviewed.'),
  attested: v.boolean(),
  attestation: v
    .union([AttestationSchema, v.null()])
    .describe('Null unless the project is in the attested set.'),
}

const ProjectSchema = v.strictObject(projectFields).describe('Project')

const stampFields = {
  attestations: AttestationsMetaSchema,
  generatedAt: v.number().describe('Unix seconds.'),
  commit: v.string().describe('The l2beat/l2beat commit the data came from.'),
}

export const CropsResponseSchema = v
  .strictObject({ ...stampFields, projects: v.array(ProjectSchema) })
  .describe('CropsResponse')

export const ProjectResponseSchema = v
  .strictObject({ ...stampFields, ...projectFields })
  .describe('ProjectResponse')

export const AddressMatchSchema = v
  .strictObject({
    id: v.string(),
    slug: v.string(),
    name: v.string(),
    href: v.union([v.string(), v.null()]),
    contractName: v
      .string()
      .describe('The contract or permission the address was matched as.'),
    crops: CropsSummarySchema,
    attestation: v.union([
      v.strictObject({ uid: v.string(), revision: v.number() }),
      v.null(),
    ]),
  })
  .describe('AddressMatch')

export const AddressResponseSchema = v
  .strictObject({
    ...stampFields,
    chainId: v.number(),
    address: v.string().describe('Lowercase.'),
    matches: v
      .array(AddressMatchSchema)
      .describe('Every reviewed project that claims the address.'),
  })
  .describe('AddressResponse')

export const AddressesResponseSchema = v
  .strictObject({
    ...stampFields,
    addresses: v
      .record(v.string(), v.array(AddressMatchSchema))
      .describe('Keyed by `chainId:address`, the address lowercase.'),
  })
  .describe('AddressesResponse')

/** Everything published under components.schemas, keyed by its `describe` name. */
export const NAMED_SCHEMAS = {
  AttestationsMeta: AttestationsMetaSchema,
  CropEvaluation: CropEvaluationSchema,
  Crops: CropsSchema,
  CropsSummary: CropsSummarySchema,
  Attestation: AttestationSchema,
  Project: ProjectSchema,
  CropsResponse: CropsResponseSchema,
  ProjectResponse: ProjectResponseSchema,
  AddressMatch: AddressMatchSchema,
  AddressResponse: AddressResponseSchema,
  AddressesResponse: AddressesResponseSchema,
}
