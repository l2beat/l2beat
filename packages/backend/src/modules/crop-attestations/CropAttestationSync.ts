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
  /** Called once the current attestation changes. */
  onChange: () => Promise<void>
  intervalMs: number
}

/**
 * Keeps the attester's current attestation in the database, for the frontend.
 * A failed read keeps the last stored one; its `updatedAt` shows how old it is.
 */
export class CropAttestationSync extends TimeLoop {
  protected logger: Logger
  /** Survives a failed `onChange`, so the next run retries it. */
  private changePending = false

  constructor(
    private readonly $: CropAttestationSyncDeps,
    logger: Logger,
  ) {
    super({ intervalMs: $.intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    if (await this.sync()) {
      this.changePending = true
    }
    if (this.changePending) {
      await this.$.onChange()
      this.changePending = false
    }
  }

  /** Returns whether the current attestation changed. */
  private async sync(): Promise<boolean> {
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
      return deleted > 0
    }
    const stored = await db.cropAttestation.find(chainId, attester)
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
    if (stored?.uid === current.uid) {
      return false
    }
    this.logger.info('New attestation', {
      uid: current.uid,
      revision: current.revision,
    })
    return true
  }
}
