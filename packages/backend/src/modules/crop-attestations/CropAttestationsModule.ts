import { CROP_ATTESTATION_SOURCE } from '@l2beat/config'
import { HttpClient, readCurrentCropAttestation } from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { CropAttestationSync } from './CropAttestationSync'
import { CropsApiDeployer } from './CropsApiDeployer'
import { triggerCropsApiDeploy } from './triggerCropsApiDeploy'

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
  if (githubToken === undefined) {
    logger.info('CROPS API deploys disabled: no GitHub token is set')
  }
  const http = new HttpClient()

  const sync = new CropAttestationSync(
    {
      db,
      chainId: source.chainId,
      attester: attester.address,
      readCurrent: () =>
        readCurrentCropAttestation(rpc, {
          eas: source.eas,
          schema: source.schema,
          schemaUid: source.schemaUid,
          attester: attester.address,
          startBlock: attester.sinceBlock,
        }),
      deployer:
        githubToken === undefined
          ? undefined
          : new CropsApiDeployer(
              db,
              () => triggerCropsApiDeploy(http, githubToken),
              logger,
            ),
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
