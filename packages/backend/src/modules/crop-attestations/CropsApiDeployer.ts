import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'

const DEPLOYED_KEY = 'cropsApiAttestationUid'

/**
 * Redeploys the CROPS API until it carries the current attestation. The one it
 * was last deployed with is kept in the database, so a deploy that failed or
 * was cut short by a restart runs again on the next call.
 */
export class CropsApiDeployer {
  private readonly logger: Logger

  constructor(
    private readonly db: Database,
    /** Republishes the CROPS API, which reads the attestation from the chain. */
    private readonly deploy: () => Promise<void>,
    logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async ensureDeployed(uid: string | undefined) {
    const deployed = await this.db.appState.findByKey(DEPLOYED_KEY)
    if (deployed?.value === uid) {
      return
    }
    await this.deploy()
    if (uid === undefined) {
      await this.db.appState.deleteByKey(DEPLOYED_KEY)
    } else {
      await this.db.appState.insert({
        key: DEPLOYED_KEY,
        value: uid,
        updatedBy: 'CropsApiDeployer',
      })
    }
    this.logger.info('Deploy triggered', { uid })
  }
}
