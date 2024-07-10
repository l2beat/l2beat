import { getVerifiersFromConfig } from '@l2beat/config/build/src/projects/other/zk-catalog'
import { UnixTime, branded } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/database'

export async function getVerifiers() {
  noStore()

  // unstable-cache is limited - uses JSON.stringify under the hood causing
  // issues with custom VOs like UnixTime - that's why we re-parse the data
  // to coerce it back to the correct types
  const cachedVerifiers = await getCachedVerifiersStatus()
  return VerifierStatuses.parse(cachedVerifiers)
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
  ['zk-catalog-verifiers'],
  { revalidate: 60 * 60 },
)

export const VerifierStatus = z.object({
  address: z.string(),
  timestamp: branded(z.number().nullable(), (n) =>
    n ? new UnixTime(n) : null,
  ),
})
export type VerifierStatus = z.infer<typeof VerifierStatus>
export const VerifierStatuses = z.array(VerifierStatus)
export type VerifierStatuses = z.infer<typeof VerifierStatuses>
