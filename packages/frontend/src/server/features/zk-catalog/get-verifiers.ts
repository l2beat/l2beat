import { getVerifiersFromConfig } from '@l2beat/config'
import { UnixTime, branded } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { db } from '~/server/database'

export async function getVerifiers() {
  if (env.MOCK) {
    return getMockVerifiers()
  }

  noStore()

  // unstable-cache is limited - uses JSON.stringify under the hood causing
  // issues with custom VOs like UnixTime - that's why we re-parse the data
  // to coerce it back to the correct types
  const cachedVerifiers = await getCachedVerifiersStatus()
  return VerifiersStatuses.parse(cachedVerifiers)
}

const getCachedVerifiersStatus = cache(
  async () => {
    const verifiers = getVerifiersFromConfig()

    const coercedQueries = verifiers.map(async (verifier) => {
      const status = await db.verifierStatus.findVerifierStatus(
        verifier.contractAddress.toString(),
        verifier.chainId,
      )

      return {
        address: verifier.contractAddress.toString(),
        timestamp: status ? status.lastUsed.toNumber() : null,
      }
    })

    return Promise.all(coercedQueries)
  },
  ['zkCatalogVerifiers'],
  { revalidate: 10 * UnixTime.MINUTE },
)

function getMockVerifiers() {
  const verifiers = getVerifiersFromConfig()
  return verifiers.map((v) => ({
    address: v.contractAddress.toString(),
    timestamp: UnixTime.now(),
  }))
}

export const VerifierStatus = z.object({
  address: z.string(),
  timestamp: branded(z.number().nullable(), (n) =>
    n ? new UnixTime(n) : null,
  ),
})
export type VerifierStatus = z.infer<typeof VerifierStatus>
export const VerifiersStatuses = z.array(VerifierStatus)
export type VerifiersStatuses = z.infer<typeof VerifiersStatuses>
