import type { Logger } from '@l2beat/backend-tools'
import type { CropAttestationSource } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { CropAttestation } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../tools/TimeLoop'

export interface CropAttestationSyncDeps {
  db: Database
  source: CropAttestationSource
  /** The attester's current attestation, read from EAS. */
  readCurrent: () => Promise<CropAttestation | undefined>
  intervalMs: number
}

/**
 * Keeps the attester's current attestation in the database, for the frontend.
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
    const { db, source } = this.$
    const current = await this.$.readCurrent()
    if (!current) {
      const deleted = await db.cropAttestation.delete(
        source.chainId,
        source.attester,
      )
      if (deleted > 0) {
        // Expected only after the attester revokes everything; otherwise suspect the RPC.
        this.logger.warn('The attester no longer has an attestation', {
          attester: source.attester,
        })
      }
      return
    }
    await db.cropAttestation.upsert({
      chainId: source.chainId,
      attester: source.attester,
      uid: current.uid,
      revision: current.revision,
      reviewedAt: UnixTime(current.reviewedAt),
      projectIds: current.projectIds,
      txHash: current.txHash,
      blockNumber: current.blockNumber,
      updatedAt: UnixTime.now(),
    })
  }
}
