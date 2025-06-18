import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import uniq from 'lodash/uniq'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'

export async function getVerifiers() {
  if (env.MOCK) {
    return getMockVerifiers()
  }

  const db = getDb()
  const projects = await ps.getProjects({
    select: ['proofVerification'],
    whereNot: ['archivedAt'],
  })

  const verifiers = projects.flatMap((p) => p.proofVerification.verifiers)

  const statuses = await db.verifierStatus.getVerifierStatuses(
    uniq(verifiers.map((v) => v.contractAddress.toString())),
  )

  return verifiers.map((verifier) => {
    const status = statuses.find(
      (s) =>
        s.address === verifier.contractAddress.toString() &&
        s.chainId === verifier.chainId,
    )
    return {
      address: verifier.contractAddress.toString(),
      timestamp: status ? status.lastUsed : null,
    }
  })
}

async function getMockVerifiers() {
  const projects = await ps.getProjects({
    select: ['proofVerification'],
    whereNot: ['archivedAt'],
  })
  return projects
    .flatMap((p) => p.proofVerification.verifiers)
    .map((v) => ({
      address: v.contractAddress.toString(),
      timestamp: UnixTime.now(),
    }))
}

const VerifierStatus = v.object({
  address: v.string(),
  timestamp: v
    .union([v.number(), v.null()])
    .transform((n) => (n ? UnixTime(n) : null)),
})
export const VerifiersStatuses = v.array(VerifierStatus)
export type VerifiersStatuses = v.infer<typeof VerifiersStatuses>
