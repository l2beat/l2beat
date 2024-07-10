import { getVerifiersFromConfig } from '@l2beat/config/build/src/projects/other/zk-catalog'
import { VerifiersApiResponse } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'

export async function getVerifiers() {
  noStore()

  // unstable-cache is limited - uses JSON.stringify under the hood causing
  // issues with custom VOs like UnixTime - that's why we re-parse the data
  // to coerce it back to the correct types
  const cachedVerifiers = await getCachedVerifiersStatus()
  return VerifiersApiResponse.parse(cachedVerifiers)
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
        timestamp: status ? status.lastUsed : null,
      }
    })

    return Promise.all(coercedQueries)
  },
  ['zk-catalog-verifiers'],
  { revalidate: 60 * 60 },
)
