import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { TimeLoop } from '../../tools/TimeLoop'

const DEPLOYED_KEY = 'cropsApiAttestationUid'

export interface CropsApiDeployerDeps {
  db: Database
  chainId: number
  attester: string
  /** Republishes the CROPS API, which reads the attestation from the chain. */
  deploy: () => Promise<void>
  intervalMs: number
}

/**
 * Redeploys the CROPS API while the stored attestation differs from the one
 * it was last deployed with. That one is kept in the database, so a deploy
 * that failed or was cut short by a restart runs again on the next pass.
 */
export class CropsApiDeployer extends TimeLoop {
  protected logger: Logger

  constructor(
    private readonly $: CropsApiDeployerDeps,
    logger: Logger,
  ) {
    super({ intervalMs: $.intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const { db, chainId, attester } = this.$
    const [current, deployed] = await Promise.all([
      db.cropAttestation.find(chainId, attester),
      db.appState.findByKey(DEPLOYED_KEY),
    ])
    const uid = current?.uid
    if (deployed?.value === uid) {
      return
    }
    await this.$.deploy()
    if (uid === undefined) {
      await db.appState.deleteByKey(DEPLOYED_KEY)
    } else {
      await db.appState.insert({
        key: DEPLOYED_KEY,
        value: uid,
        updatedBy: 'CropsApiDeployer',
      })
    }
    this.logger.info('CROPS API deploy triggered', { uid })
  }
}
