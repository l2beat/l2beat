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
 * generated. Once an attester is set, a missing RPC fails the generation
 * rather than publish an API that claims nothing is attested.
 */
export async function readAttestationsMeta(
  rpcUrl: string | undefined,
): Promise<CropsAttestationsMeta> {
  const source = CROP_ATTESTATION_SOURCE
  if (!source.attester) {
    return getCropsAttestationsMeta(undefined)
  }
  if (!rpcUrl) {
    throw new Error('CROPS_ATTESTATIONS_RPC_URL is required')
  }
  const rpc = new RpcClient({
    chain: source.network,
    url: rpcUrl,
    http: new HttpClient(),
    logger: Logger.SILENT,
    callsPerMinute: 60,
    retryStrategy: 'SCRIPT',
  })
  return getCropsAttestationsMeta(
    await readCurrentCropAttestation(rpc, {
      eas: source.eas,
      schema: source.schema,
      schemaUid: source.schemaUid,
      attester: source.attester.address,
      startBlock: source.attester.sinceBlock,
    }),
  )
}
