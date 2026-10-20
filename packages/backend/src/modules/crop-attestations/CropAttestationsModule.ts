import { CROP_ATTESTATION_SOURCE } from '@l2beat/config'
import { HttpClient, readCurrentCropAttestation } from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { CropAttestationSync } from './CropAttestationSync'
import { CropsApiDeployer } from './CropsApiDeployer'
import { triggerCropsApiDeploy } from './triggerCropsApiDeploy'

const INTERVAL_MS = 5 * 60 * 1000
/** Only reads the database, so it can look often. */
const DEPLOY_INTERVAL_MS = 60 * 1000

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
      intervalMs: INTERVAL_MS,
    },
    logger,
  )

  const { githubToken } = config.cropAttestations
  const http = new HttpClient()
  const deployer =
    githubToken === undefined
      ? undefined
      : new CropsApiDeployer(
          {
            db,
            chainId: source.chainId,
            attester: attester.address,
            deploy: () => triggerCropsApiDeploy(http, githubToken),
            intervalMs: DEPLOY_INTERVAL_MS,
          },
          logger,
        )
  if (!deployer) {
    logger.info('CROPS API deploys disabled: no GitHub token is set')
  }

  return {
    start: () => {
      sync.start()
      deployer?.start()
    },
  }
}
