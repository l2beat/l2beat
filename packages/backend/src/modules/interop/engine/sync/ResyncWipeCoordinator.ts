import type { Logger } from '@l2beat/backend-tools'
import type { LongChainName, UnixTime } from '@l2beat/shared-pure'

export class ResyncWipeCoordinator {
  private currentRequestId?: UnixTime
  private waitingChains = new Set<LongChainName>()
  private wipeInProgressFor?: UnixTime
  private wipeCompletedFor?: UnixTime

  constructor(
    private readonly clusterName: string,
    private readonly chains: LongChainName[],
    private readonly logger: Logger,
  ) {}

  async waitForWipe(params: {
    requestId: UnixTime
    chain: LongChainName
    wipe: () => Promise<void>
  }): Promise<boolean> {
    const { requestId, chain, wipe } = params

    if (
      this.currentRequestId === undefined ||
      requestId > this.currentRequestId
    ) {
      this.currentRequestId = requestId
      this.waitingChains.clear()
    }

    if (
      this.currentRequestId !== undefined &&
      requestId < this.currentRequestId
    ) {
      return false
    }

    if (this.wipeCompletedFor === requestId) {
      return true
    }

    this.waitingChains.add(chain)
    if (this.waitingChains.size < this.chains.length) {
      return false
    }

    if (this.wipeInProgressFor !== undefined) {
      return false
    }

    this.wipeInProgressFor = requestId
    try {
      this.logger.info('Resync wipe starting', {
        pluginName: this.clusterName,
        requestId,
      })
      await wipe()
      this.wipeCompletedFor = requestId
      this.logger.info('Resync wipe completed', {
        pluginName: this.clusterName,
        requestId,
      })
    } finally {
      if (this.wipeInProgressFor === requestId) {
        this.wipeInProgressFor = undefined
      }
    }

    return true
  }
}
