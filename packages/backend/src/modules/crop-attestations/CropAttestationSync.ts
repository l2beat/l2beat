import type { Logger } from '@l2beat/backend-tools'
import type { CropAttestationSource } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { CropAttestation } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { TimeLoop } from '../../tools/TimeLoop'
import type { CropsApiDeployer } from './CropsApiDeployer'

/** Where the attestation is read from, stored with it for the frontend. */
export type CropAttestationSyncSource = Omit<
  CropAttestationSource,
  'attester'
> & { attester: string }

export interface CropAttestationSyncDeps {
  db: Database
  source: CropAttestationSyncSource
  /** The attester's current attestation, read from EAS. */
  readCurrent: () => Promise<CropAttestation | undefined>
  /** Unset where this backend should not republish the CROPS API. */
  deployer?: CropsApiDeployer
  intervalMs: number
}

/**
 * Keeps the attester's current attestation in the database, for the frontend,
 * and has the CROPS API redeployed with it.
 * The row carries its source, so the frontend needs no config of its own: after
 * a source change it shows the previous attestation until this sync switches.
 * A failed read keeps the last stored one; its `updatedAt` shows how old it is.
 */
export class CropAttestationSync extends TimeLoop {
  protected logger: Logger
  private readonly configId: string

  constructor(
    private readonly $: CropAttestationSyncDeps,
    logger: Logger,
  ) {
    super({ intervalMs: $.intervalMs })
    this.logger = logger.for(this)
    this.configId = createCropAttestationConfigId($.source)
  }

  async run() {
    const current = await this.$.readCurrent()
    await this.store(current)
    const removed = await this.$.db.cropAttestation.deleteAllExcept(
      this.configId,
    )
    if (removed > 0) {
      this.logger.info('Removed the attestations of a previous source', {
        removed,
      })
    }
    await this.$.deployer?.ensureDeployed(current?.uid)
  }

  private async store(current: CropAttestation | undefined) {
    const { db, source } = this.$
    if (!current) {
      const deleted = await db.cropAttestation.delete(this.configId)
      if (deleted > 0) {
        // Expected only after the attester revokes everything; otherwise suspect the RPC.
        this.logger.warn('The attester no longer has an attestation', {
          attester: source.attester,
        })
      }
      return
    }
    await db.cropAttestation.upsert({
      configId: this.configId,
      ...source,
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

/** Changes with any field of the source, as the row stores them all. */
export function createCropAttestationConfigId(
  source: CropAttestationSyncSource,
): string {
  const input = [
    source.network,
    source.chainId,
    source.eas,
    source.explorer,
    source.schema,
    source.schemaUid,
    source.attester,
  ]
  const hash = createHash('sha1').update(JSON.stringify(input)).digest('hex')
  return hash.slice(0, 12)
}
