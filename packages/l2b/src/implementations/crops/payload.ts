import { ProjectService } from '@l2beat/config'
import { ATTESTATION_SCHEMA } from '@l2beat/config/build/crops/eas'
import { decodeAbiParameters, encodeAbiParameters, type Hex } from 'viem'
import { assertAnonymous } from './anonymity'

/** The attested fields, in schema order. */
export const ATTESTATION_PARAMS = [
  { name: 'projectIds', type: 'string[]' },
  { name: 'reviewedAt', type: 'uint64' },
  { name: 'revision', type: 'uint32' },
] as const

export interface CropPayload {
  /** The whole reviewed set, sorted. Details for each id live in the API. */
  projectIds: string[]
  reviewedAt: number
  revision: number
}

/** Every project that declares crops, by id, sorted. */
export async function getAttestedProjectIds(
  ps = new ProjectService(),
): Promise<string[]> {
  const projects = await ps.getProjects({ where: ['crops'], select: ['crops'] })
  return projects
    .map((project) => project.id)
    .sort((a, b) => a.localeCompare(b))
}

export function toPayload(
  projectIds: string[],
  reviewedAt: number,
  revision: number,
): CropPayload {
  return { projectIds: [...projectIds].sort(), reviewedAt, revision }
}

export function encodePayload(payload: CropPayload): Hex {
  // The anonymity rule applies to what actually lands onchain, so check the
  // schema and the string values rather than the hex blob they encode to.
  assertAnonymous('The attestation schema', ATTESTATION_SCHEMA)
  assertAnonymous('The attested set', payload.projectIds.join(' '))

  return encodeAbiParameters(ATTESTATION_PARAMS, [
    payload.projectIds,
    BigInt(payload.reviewedAt),
    payload.revision,
  ])
}

export function decodePayload(data: Hex): CropPayload {
  const [projectIds, reviewedAt, revision] = decodeAbiParameters(
    ATTESTATION_PARAMS,
    data,
  )
  return {
    projectIds: [...projectIds],
    reviewedAt: Number(reviewedAt),
    revision: Number(revision),
  }
}

/** Whether an onchain set still says what the config says. Order-insensitive. */
export function setMatches(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  const sortedB = [...b].sort()
  return [...a].sort().every((id, i) => id === sortedB[i])
}

export function diffSet(
  wanted: string[],
  current: string[],
): { added: string[]; removed: string[] } {
  return {
    added: wanted.filter((x) => !current.includes(x)),
    removed: current.filter((x) => !wanted.includes(x)),
  }
}

export function describePayload(payload: CropPayload): string {
  return `${payload.projectIds.length} projects rev=${payload.revision}`
}
