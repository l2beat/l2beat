import { CROP_ATTESTATION_SOURCE } from '@l2beat/config'
import { HttpClient, readCurrentCropAttestation } from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { CropAttestationSync } from './CropAttestationSync'
import { CropsApiDeployer } from './CropsApiDeployer'

const INTERVAL_MS = 5 * 60 * 1000

export function createCropAttestationsModule({
  config,
  logger,
  db,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.cropAttestations) {
    logger.info('Crop attestations module disabled')
    return
  }
  const source = CROP_ATTESTATION_SOURCE
  const attester = source.attester
  if (!attester) {
    logger.info('Crop attestations module idle: no attester is set')
    return
  }

  logger = logger.tag({
    feature: 'crop-attestations',
    module: 'crop-attestations',
  })
  const rpc = providers.clients.getRpcClient(source.network)

  const { githubToken } = config.cropAttestations
  let deployer: CropsApiDeployer | undefined
  if (githubToken) {
    deployer = new CropsApiDeployer(db, new HttpClient(), githubToken, logger)
  } else {
    logger.info('CROPS API deploys disabled: no GitHub token is set')
  }

  const sync = new CropAttestationSync(
    {
      db,
      source: { ...source, attester: attester.address },
      readCurrent: () =>
        readCurrentCropAttestation(rpc, {
          eas: source.eas,
          schema: source.schema,
          schemaUid: source.schemaUid,
          attester: attester.address,
          startBlock: attester.sinceBlock,
        }),
      deployer,
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
