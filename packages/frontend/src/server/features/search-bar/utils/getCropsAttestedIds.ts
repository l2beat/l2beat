import { getAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { getLogger } from '~/server/utils/logger'

/**
 * Ids the current CROPS attestation names. Search stays useful without them,
 * so a failed read only leaves out the DeFi projects found through CROPS.
 */
export async function getCropsAttestedIds(): Promise<ReadonlySet<string>> {
  try {
    const { current } = await getAttestationsMeta()
    return new Set(current?.projectIds)
  } catch (error) {
    getLogger()
      .for('getCropsAttestedIds')
      .error('CROPS attestation unavailable', { error })
    return new Set()
  }
}
