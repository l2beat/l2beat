import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CropAttestation } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'

export interface CropAttestationSyncDeps {
  db: Database
  chainId: number
  attester: string
  /** The attester's current attestation, read from EAS. */
  readCurrent: () => Promise<CropAttestation | undefined>
  /** Republishes the CROPS API. Unset where this backend should not. */
  deployApi: (() => Promise<void>) | undefined
  intervalMs: number
}

/**
 * Keeps the attester's current attestation in the database, for the frontend,
 * and redeploys the CROPS API until it carries the same one.
 * A failed read keeps the last stored one; its `updatedAt` shows how old it is.
 */
export class CropAttestationSync extends TimeLoop {
  protected logger: Logger

  constructor(
    private readonly $: CropAttestationSyncDeps,
    logger: Logger,
  ) {
    super({ intervalMs: $.intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const current = await this.sync()
    if (this.$.deployApi) {
      await this.deployApi(this.$.deployApi, current?.uid)
    }
  }

  private async sync(): Promise<CropAttestation | undefined> {
    const { db, chainId, attester } = this.$
    const current = await this.$.readCurrent()
    if (!current) {
      const deleted = await db.cropAttestation.delete(chainId, attester)
      if (deleted > 0) {
        // Expected only after the attester revokes everything; otherwise suspect the RPC.
        this.logger.warn('The attester no longer has an attestation', {
          attester,
        })
      }
      return
    }
    await db.cropAttestation.upsert({
      chainId,
      attester,
      uid: current.uid,
      revision: current.revision,
      reviewedAt: UnixTime(current.reviewedAt),
      projectIds: current.projectIds,
      txHash: current.txHash,
      blockNumber: current.blockNumber,
      updatedAt: UnixTime.now(),
    })
    return current
  }

  /**
   * Stored in the database rather than memory, so a deploy that failed or was
   * cut short by a restart runs again on the next pass.
   */
  private async deployApi(
    deploy: () => Promise<void>,
    uid: string | undefined,
  ) {
    const { db } = this.$
    const deployed = await db.appState.findByKey('cropsApiAttestationUid')
    if (deployed?.value === uid) {
      return
    }
    await deploy()
    if (uid === undefined) {
      await db.appState.deleteByKey('cropsApiAttestationUid')
    } else {
      await db.appState.insert({
        key: 'cropsApiAttestationUid',
        value: uid,
        updatedBy: 'CropAttestationSync',
      })
    }
    this.logger.info('CROPS API deploy triggered', { uid })
  }
}
