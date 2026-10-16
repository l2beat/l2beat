import { Logger } from '@l2beat/backend-tools'
import {
  CROP_ATTESTATION_SOURCE,
  getCropsAttestationsMeta,
} from '@l2beat/config'
import {
  HttpClient,
  RpcClient,
  readCurrentCropAttestation,
} from '@l2beat/shared'
import type { CropsAttestationsMeta } from './api'

/**
 * The attester's current attestation, read from EAS while the API is
 * generated. Without an RPC the generation fails rather than publish an API
 * that claims nothing is attested.
 */
export async function readAttestationsMeta(
  rpcUrl: string | undefined,
): Promise<CropsAttestationsMeta> {
  if (!rpcUrl) {
    throw new Error('CROPS_ATTESTATIONS_RPC_URL is required')
  }
  const rpc = new RpcClient({
    chain: CROP_ATTESTATION_SOURCE.network,
    url: rpcUrl,
    http: new HttpClient(),
    logger: Logger.SILENT,
    callsPerMinute: 60,
    retryStrategy: 'SCRIPT',
  })
  return getCropsAttestationsMeta(
    await readCurrentCropAttestation(rpc, CROP_ATTESTATION_SOURCE),
  )
}
