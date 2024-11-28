import { getVerifiersFromConfig } from '@l2beat/config/build/src/projects/other/zk-catalog'
import { UnixTime, branded } from '@l2beat/shared-pure'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getVerifiers() {
  if (env.MOCK) {
    return getMockVerifiers()
  }

  const db = getDb()
  const verifiers = getVerifiersFromConfig()

  const coercedQueries = verifiers.map(async (verifier) => {
    const status = await db.verifierStatus.findVerifierStatus(
      verifier.contractAddress.toString(),
      verifier.chainId,
    )

    return {
      address: verifier.contractAddress.toString(),
      timestamp: status ? status.lastUsed : null,
    }
  })

  return Promise.all(coercedQueries)
}

function getMockVerifiers() {
  const verifiers = getVerifiersFromConfig()
  return verifiers.map((v) => ({
    address: v.contractAddress.toString(),
    timestamp: UnixTime.now(),
  }))
}

const VerifierStatus = z.object({
  address: z.string(),
  timestamp: branded(z.number().nullable(), (n) =>
    n ? new UnixTime(n) : null,
  ),
})
type VerifierStatus = z.infer<typeof VerifierStatus>
export const VerifiersStatuses = z.array(VerifierStatus)
export type VerifiersStatuses = z.infer<typeof VerifiersStatuses>
