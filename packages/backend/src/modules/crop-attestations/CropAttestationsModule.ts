import { CROP_ATTESTATION_SOURCE } from '@l2beat/config'
import {
  HttpClient,
  RpcClient,
  readCurrentCropAttestation,
} from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { CropAttestationSync } from './CropAttestationSync'

const INTERVAL_MS = 5 * 60 * 1000

export function createCropAttestationsModule({
  config,
  logger,
  db,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.cropAttestations) {
    logger.info('Crop attestations module disabled')
    return
  }

  logger = logger.tag({
    feature: 'crop-attestations',
    module: 'crop-attestations',
  })

  // Its own client: the attestations may live on a network no project uses.
  const rpc = new RpcClient({
    chain: CROP_ATTESTATION_SOURCE.network,
    url: config.cropAttestations.rpcUrl,
    http: new HttpClient(),
    logger,
    callsPerMinute: 60,
    retryStrategy: 'RELIABLE',
  })

  const sync = new CropAttestationSync(
    {
      db,
      source: CROP_ATTESTATION_SOURCE,
      readCurrent: () =>
        readCurrentCropAttestation(rpc, CROP_ATTESTATION_SOURCE),
      intervalMs: INTERVAL_MS,
    },
    logger,
  )

  return {
    start: () => {
      sync.start()
    },
  }
}
