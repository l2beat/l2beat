import { ProjectService } from '@l2beat/config'
import {
  type CanonicalCrops,
  CROP_KEYS,
  serializeCanonicalCrops,
  toCanonicalCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { ATTESTATION_SCHEMA } from '@l2beat/config/build/crops/eas'
import {
  decodeAbiParameters,
  encodeAbiParameters,
  type Hex,
  keccak256,
  toHex,
} from 'viem'
import { assertAnonymous } from './anonymity'

/** The attested fields, in schema order. */
export const ATTESTATION_PARAMS = [
  { name: 'projectId', type: 'string' },
  { name: 'projectName', type: 'string' },
  { name: 'censorshipResistance', type: 'string' },
  { name: 'censorshipResistanceStatus', type: 'string' },
  { name: 'openSource', type: 'string' },
  { name: 'openSourceStatus', type: 'string' },
  { name: 'privacy', type: 'string' },
  { name: 'privacyStatus', type: 'string' },
  { name: 'security', type: 'string' },
  { name: 'securityStatus', type: 'string' },
  { name: 'reviewedAt', type: 'uint64' },
  { name: 'revision', type: 'uint32' },
  { name: 'evaluationHash', type: 'bytes32' },
] as const

export interface CropPayload {
  projectId: string
  projectName: string
  /** Sentiment then status, per crop, in CROP_KEYS order. */
  ratings: [string, string][]
  reviewedAt: number
  revision: number
  evaluationHash: Hex
}

export interface CropSubject {
  projectId: string
  projectName: string
  canonical: CanonicalCrops
  evaluationHash: Hex
}

/** Every project that declares crops, with its canonical form and hash. */
export async function getCropSubjects(
  ps = new ProjectService(),
): Promise<CropSubject[]> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
  })
  return projects
    .map((project) => {
      const canonical = toCanonicalCrops(
        project.id,
        project.name,
        project.crops,
      )
      return {
        projectId: project.id,
        projectName: project.name,
        canonical,
        evaluationHash: hashEvaluation(canonical),
      }
    })
    .sort((a, b) => a.projectId.localeCompare(b.projectId))
}

export function hashEvaluation(canonical: CanonicalCrops): Hex {
  return keccak256(toHex(serializeCanonicalCrops(canonical)))
}

export function toPayload(
  subject: CropSubject,
  reviewedAt: number,
  revision: number,
): CropPayload {
  return {
    projectId: subject.projectId,
    projectName: subject.projectName,
    ratings: CROP_KEYS.map((key) => {
      const evaluation = subject.canonical.crops[key]
      return [evaluation.sentiment, evaluation.status] as [string, string]
    }),
    reviewedAt,
    revision,
    evaluationHash: subject.evaluationHash,
  }
}

export function encodePayload(payload: CropPayload): Hex {
  const values = [
    payload.projectId,
    payload.projectName,
    ...payload.ratings.flat(),
  ]
  // The anonymity rule applies to what actually lands onchain, so check the
  // schema and the string values rather than the hex blob they encode to.
  assertAnonymous('The attestation schema', ATTESTATION_SCHEMA)
  assertAnonymous(`The payload for ${payload.projectId}`, values.join(' '))

  return encodeAbiParameters(ATTESTATION_PARAMS, [
    payload.projectId,
    payload.projectName,
    ...(payload.ratings.flat() as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ]),
    BigInt(payload.reviewedAt),
    payload.revision,
    payload.evaluationHash,
  ])
}

export function decodePayload(data: Hex): CropPayload {
  const decoded = decodeAbiParameters(ATTESTATION_PARAMS, data)
  const [projectId, projectName, ...rest] = decoded
  const ratings: [string, string][] = []
  for (let i = 0; i < CROP_KEYS.length; i++) {
    ratings.push([rest[i * 2] as string, rest[i * 2 + 1] as string])
  }
  return {
    projectId,
    projectName,
    ratings,
    reviewedAt: Number(decoded[10]),
    revision: Number(decoded[11]),
    evaluationHash: decoded[12],
  }
}

/** Whether an onchain payload still says what the config says. */
export function payloadMatches(a: CropPayload, b: CropPayload): boolean {
  return (
    a.projectId === b.projectId &&
    a.projectName === b.projectName &&
    a.evaluationHash.toLowerCase() === b.evaluationHash.toLowerCase() &&
    a.ratings.length === b.ratings.length &&
    a.ratings.every(
      (rating, i) =>
        rating[0] === b.ratings[i]?.[0] && rating[1] === b.ratings[i]?.[1],
    )
  )
}

export function describePayload(payload: CropPayload): string {
  return CROP_KEYS.map(
    (key, i) => `${key}=${payload.ratings[i]?.join('/')}`,
  ).join(' ')
}
